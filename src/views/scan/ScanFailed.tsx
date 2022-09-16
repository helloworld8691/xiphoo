import React from 'react';
import {Dimensions, Image, LayoutAnimation, Platform, StyleSheet, UIManager, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import XiphooLogo from '../../assets/svg/scan_failed.svg';
import {mainStyles} from '../../base/MainStyles';
import {CustomerTheme} from '../../base/Theme';
import {MainButton, MainHeader} from '../../components';
import {RootText} from '../../components/RootText';
import {resetAction, resetActionSoft, startScanning, startScanningIOS} from '../../redux/scanProduct';
import {StateType} from '../../redux/store';
import {MainStackParamList} from '../MainParamList';

export const ScanFailed = ({navigation, route}: MainStackParamList<'ScanFailed'>) => {
  const dispatch = useDispatch();
  const {
    result,
    fetching: {
      startScanning: {success, error},
    },
  } = useSelector((state: StateType) => state.scanProduct);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  const tryAgain = () => {
    dispatch(resetActionSoft());
    if (Platform.OS == 'android') dispatch(startScanning());
    else dispatch(startScanningIOS());
  };
  return (
    <>
      <MainHeader title="Scan" onMenuPress={() => navigation.openDrawer()} />
      <SafeAreaView style={[{backgroundColor: 'white', height: '100%'}]} edges={['left', 'right', 'bottom']}>
        <View style={styles.mainView}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 'auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <View style={styles.outerCircle2}>
                <View style={styles.outerCircle1}>
                  <View style={styles.circle}>
                    <XiphooLogo width={'70%'} height={'70%'} />
                  </View>
                </View>
              </View>
              <View style={{alignItems: 'center'}}>
                <RootText fontWeight={700} style={[mainStyles.mainTitle, {marginBottom: 20, color: '#a00'}]}>
                  {error?.type == 'TagWriteError' ? 'Tag was removed too early' : 'Could not read tag'}
                  {success && '\nThis tag is not a Xiphoo Tag'}
                </RootText>
                <RootText fontWeight={600} style={mainStyles.mainText}>
                  {error?.type == 'TagWriteError'
                    ? 'Please try again and hold your phone just a bit longer on the Tag.'
                    : success
                    ? 'This app can only read NFC tags that are registered for Xiphoo services'
                    : 'An error occured while scanning the tag. Please try again.'}
                </RootText>
              </View>
              <MainButton buttonStyle={{marginTop: 20}} onPress={tryAgain}>
                <RootText style={mainStyles.buttonText}>Try again</RootText>
              </MainButton>
              {!success && (
                <MainButton buttonStyle={{marginTop: 10}} onPress={() => navigation.navigate('HelpInfo')}>
                  <RootText style={mainStyles.buttonText}>Help</RootText>
                </MainButton>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: '100%',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: CustomerTheme.colors['main-brown'],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
  },
  outerCircle1: {
    height: '100%',
    width: '100%',
    backgroundColor: CustomerTheme.colors['main-brown'] + '80',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    padding: 4,
  },
  outerCircle2: {
    height: Dimensions.get('window').height * 0.2,
    aspectRatio: 1,
    backgroundColor: CustomerTheme.colors['main-brown'] + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    padding: 4,
  },
  mainView: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});
