//React Navigation 5
import {NavigationContainer, StackActions, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';

//@ts-ignore
import DeviceSettings from 'react-native-device-settings';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

//React Navigation 5 Drawer
import {CustomerTheme} from './src/base/Theme';
import XiphooLogoGray from './src/assets/svg/logo_gray.svg';
import XiphooLogoWhite from './src/assets/svg/logo_white.svg';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {useNetInfo} from '@react-native-community/netinfo';

//Views
import {Home, SplashScreen, Settings, Impressum, ProductResult, BarcodeScanner, HelpInfo, ScanFailed, Login, ProductRegistration, BarcodeScannerFailed} from './src/views';
import {useEffect} from 'react';
import {StyleSheet, Linking, Touchable, TouchableWithoutFeedback, Alert, AppState, Platform} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCog, faInfoCircle, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {RootText} from './src/components/RootText';
import {StateType} from './src/redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {InformationPopup} from './src/components';
import {BarcodeScannerCamera} from './src/views/productRegistration/BarcodeScannerCamera';
import {ScreenWithCustomBackBehavior} from './src/components/ScreenWithCustomBackBehaviour';
import {resetAction, resetActionSoft, startScanning, startScanningAtLaunch} from './src/redux/scanProduct';
import {resetAction as prReset} from './src/redux/productRegistration';
import {SPLASH_SCREEN_TIME} from './config';
import {DrawerContent} from './src/components/DrawerContent';

//React Navigation 5 - Setup
const RootStack = createStackNavigator();
const ProductStack = createStackNavigator();
const ScanStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const linking = {
  prefixes: [],
  config: [],
};

export default function Router() {
  const scanningSuccess = useSelector((state: StateType) => state.scanProduct.fetching.startScanning.success);
  const [showSplash, setShowSplash] = React.useState(true);

  const [networkError, _setNetworkError] = React.useState(false);
  const [lastNetworkError, setLastNetworkError] = React.useState(false);
  const [noNFCOnDevice, setNoNFCOnDevice] = React.useState(false);
  const [isNFCSupported, setIsNFCSupported] = React.useState(true);

  const netinfo = useNetInfo();
  const setNetworkError = (error: boolean) => {
    setLastNetworkError((lastError) => {
      if (error == true && lastError == true) {
        return error;
      }
      _setNetworkError(error);
      return error;
    });
  };

  useEffect(() => {
    if (lastNetworkError) _setNetworkError(lastNetworkError);
  }, [scanningSuccess]);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_SCREEN_TIME);
  }, []);

  useEffect(() => {
    if (!netinfo.isConnected) var timeout = setTimeout(() => setNetworkError(!netinfo.isConnected), 1000);
    else setNetworkError(false);
    return () => timeout && clearTimeout(timeout);
  }, [netinfo]);

  useEffect(() => {
    const checkForErrors = async () => {
      setNoNFCOnDevice(!(await NfcManager.isEnabled()));
      setIsNFCSupported(await NfcManager.isSupported());
    };
    checkForErrors();
    let interval = setInterval(checkForErrors, 1000);
    return () => clearInterval(interval);
  }, []);

  const dispatch = useDispatch();

  const dispatchStartAction = () => {
    if (Platform.OS == 'android') {
      dispatch(startScanningAtLaunch());
    }
  };

  useEffect(() => {
    dispatchStartAction();
    // const launchEvent = {true: true};
    // AppState.addEventListener('change', (state) => {
    //   console.log("🚀 ~ file: Router.tsx ~ line 97 ~ AppState.addEventListener ~ state", state)
    //   if (state == 'background') {
    //     NfcManager.unregisterTagEvent().catch(() => 0);
    //     NfcManager.cancelTechnologyRequest().catch(() => 0);
    //   }
    // });
  }, []);
  return (
    <NavigationContainer
      linking={{
        prefixes: ['https://scan.xiphoo.com', 'http://scan.xiphoo.com'],
        config: {
          screens: {
            Home: '/',
          },
        },
        subscribe(listener) {
          const onReceiveURL = ({url}: {url: string}) => {
            if (/https?:\/\/scan.xiphoo.com/) dispatchStartAction();
            listener(url);
          };
          Linking.addEventListener('url', onReceiveURL);
          return () => {
            Linking.removeEventListener('url', onReceiveURL);
          };
        },
      }}>
      <RootStack.Navigator headerMode="none">
        {showSplash == true ? <RootStack.Screen name="Loading" component={SplashScreen} /> : <Drawer.Screen name="Main" component={MainDrawer} />}
      </RootStack.Navigator>
      <InformationPopup
        type="error"
        title={'You are currently offline'}
        description={'Please connect to a network to scan and verify.'}
        visible={networkError}
        onClosePress={() => {
          _setNetworkError(false);
        }}
        buttonText={'Connection Settings'}
        onButtonPress={() => {
          DeviceSettings.wifi();
        }}
      />
      <InformationPopup
        type="error"
        title={'NFC is currently deactivated'}
        description={'Please enable NFC to use the Xiphoo Scanner App.'}
        visible={noNFCOnDevice}
        onClosePress={() => {
          setNoNFCOnDevice(false);
        }}
        buttonText={'Open Settings'}
        onButtonPress={() => {
          if(Platform.OS == "android")
            NfcManager.goToNfcSetting();
        }}
      />
      <InformationPopup
        type="error"
        title={'NFC not available'}
        description={'You cannot use this app because it havily relies on NFC.'}
        visible={!isNFCSupported}
        onClosePress={() => {}}
      />
    </NavigationContainer>
  );
}

const ScanFailedWithBackBehaviour = (props: any) => {
  const dispatch = useDispatch();

  return (
    <ScreenWithCustomBackBehavior onBackPress={() => dispatch(resetActionSoft())}>
      <ScanFailed {...props} />
    </ScreenWithCustomBackBehavior>
  );
};

function Scan() {
  const {
    fetching: {
      startScanning: {error, fetching, success, tagDetected},
    },
    result,
  } = useSelector((state: StateType) => state.scanProduct);
  const dispatch = useDispatch();
  const shouldRenderProductResult = success && result?.tagInfo.offlineCheck;
  const shouldRenderScanningFailed = error || (success && !result?.tagInfo.offlineCheck);
  const shouldRenderHome = !(shouldRenderProductResult || shouldRenderScanningFailed);

  return (
    <ScanStack.Navigator headerMode="none" initialRouteName="Home" detachInactiveScreens={false}>
      {/* <ScanStack.Screen 
        name="Home"
        component={Home}/> */}
      {shouldRenderProductResult && <ScanStack.Screen name="Home" component={ProductResult} />}
      {shouldRenderScanningFailed && <ScanStack.Screen name="Home" component={ScanFailedWithBackBehaviour} />}
      {shouldRenderHome && <ScanStack.Screen name="Home" component={Home} />}
      <ScanStack.Screen name="HelpInfo" component={HelpInfo} />
    </ScanStack.Navigator>
  );
}
function Product() {
  return (
    <ProductStack.Navigator headerMode="none">
      <ProductStack.Screen name="ProductRegistration" component={ProductRegistrationScreens} />
    </ProductStack.Navigator>
  );
}

function ProductRegistrationScreens(props: any) {
  const {
    fetching: {fetchProduct},
  } = useSelector((state: StateType) => state.productRegistration);
  const {
    settings: {hasDedicatedScannerHardware},
  } = useSelector((state: StateType) => state.settings);
  const dispatch = useDispatch();
  if (!fetchProduct.success && !fetchProduct.error) {
    if (hasDedicatedScannerHardware) return <BarcodeScanner {...props} />;
    else return <BarcodeScannerCamera {...props} />;
  }
  if (fetchProduct.success && !fetchProduct.fetching)
    return (
      <ScreenWithCustomBackBehavior onBackPress={() => dispatch(prReset())}>
        <ProductRegistration {...props} />
      </ScreenWithCustomBackBehavior>
    );
  if (fetchProduct.error)
    return (
      <ScreenWithCustomBackBehavior onBackPress={() => dispatch(prReset())}>
        <BarcodeScannerFailed {...props} />
      </ScreenWithCustomBackBehavior>
    );

  return null;
}

function MainDrawer() {
  const {user} = useSelector((state: StateType) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const reset = async () => {
    await dispatch(resetAction());
    await dispatch(startScanning());
    navigation.navigate('Home');
  };
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="Scan">
      {/* <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerLabel: ({focused}) => (
            <RootText
              fontWeight={700}
              style={[
                styles.drawerTitle,
                {
                  color: focused ? 'white' : CustomerTheme.colors['main-gray'],
                },
              ]}>
              Settings
            </RootText>
          ),
          drawerIcon: ({focused}) => <FontAwesomeIcon icon={faCog} size={24} color={focused ? 'white' : CustomerTheme.colors['main-gray']} style={[styles.drawerIcon]} />,
        }}
      /> */}
      <Drawer.Screen
        name="Information"
        component={Impressum}
        options={{
          drawerLabel: ({focused}) => (
            <RootText
              fontWeight={700}
              style={[
                styles.drawerTitle,
                {
                  color: !focused ? 'white' : CustomerTheme.colors['main-gray'],
                },
              ]}>
              Information
            </RootText>
          ),
          drawerIcon: ({focused}) => <FontAwesomeIcon icon={faInfoCircle} size={24} color={!focused ? 'white' : CustomerTheme.colors['main-gray']} style={[styles.drawerIcon]} />,
        }}
      />
      {user && Platform.OS == 'android' && (
        <Drawer.Screen
          name="ProductRegistration"
          component={Product}
          options={{
            drawerLabel: ({focused}) => (
              <RootText
                fontWeight={700}
                style={[
                  styles.drawerTitle,
                  {
                    color: !focused ? 'white' : CustomerTheme.colors['main-gray'],
                  },
                ]}>
                Product Registration
              </RootText>
            ),
            drawerIcon: ({focused}) => <FontAwesomeIcon icon={faPlusCircle} size={24} color={!focused ? 'white' : CustomerTheme.colors['main-gray']} style={[styles.drawerIcon]} />,
          }}
        />
      )}
      {!user && Platform.OS == 'android' && <Drawer.Screen name="Login" options={{title: 'Corporate Login'}} component={Login} />}
      <Drawer.Screen
        name="Scan"
        component={Scan}
        options={{
          drawerLabel: ({focused}) => {
            useEffect(() => {
              if (focused) reset();
            }, [focused]);
            return (
              // <TouchableOpacity
              //   onPress={reset}
              //   style={{
              //     marginVertical: -22,
              //     paddingVertical: 22,
              //     marginLeft: -70,
              //     paddingLeft: 70,
              //     marginRight: -50,
              //     zIndex: 999,
              //     paddingRight: 50,
              //   }}
              //   activeOpacity={1}
              //   hitSlop={{bottom: 30, left: 30, right: 60, top: 30}}>
              <RootText
                fontWeight={700}
                style={[
                  styles.drawerTitle,
                  {
                    color: !focused ? 'white' : CustomerTheme.colors['main-gray'],
                  },
                ]}>
                Scanning
              </RootText>
              // </TouchableOpacity>
            );
          },
          headerStyle: {margin: 0, padding: 0},
          unmountOnBlur: true,
          headerTitleStyle: {color: 'red'},
          drawerIcon: ({focused}) => (!focused ? <XiphooLogoWhite style={[styles.drawerIcon]} width={26} /> : <XiphooLogoGray style={[styles.drawerIcon]} width={26} />),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerIcon: {
    height: 24,
    width: 24,
    padding: 0,
    margin: 0,
    marginLeft: 8,
    marginRight: -20, //Fix to look like in the XD Design
  },
  drawerTitle: {
    fontSize: 15,
    padding: 0,
    margin: 0,
    marginRight: -20, //Fix to look like in the XD Design
  },
});
