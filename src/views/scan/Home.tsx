import React, {useCallback, useState} from 'react';
import {Dimensions, Image, LayoutAnimation, Platform, StyleSheet, UIManager, View, Animated} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Scan} from '../../assets/images';
import XiphooLogo from '../../assets/svg/logo_white.svg';
import {mainStyles} from '../../base/MainStyles';
import {CustomerTheme} from '../../base/Theme';
import {MainButton, MainHeader} from '../../components';
import {RootText} from '../../components/RootText';
import {resetAction, resetActionSoft, startScanningIOS, startScanningRequestAction} from '../../redux/scanProduct';
import {StateType} from '../../redux/store';
import {MainStackParamList} from '../MainParamList';
import { useAnimation } from '../../hooks/useAnimation';

export const Home = ({navigation, route}: MainStackParamList<'Home'>) => {
  var {
    fetching: {
      startScanning: {error, fetching: scanning, success, tagDetected, shadowScanning},
    },
  } = useSelector((state: StateType) => state.scanProduct);

  const dispatch = useDispatch();
  const value = useAnimation(scanning);

  const outerCircleWidth1 = scanning
    ? value.interpolate({
        inputRange: [0, 1],
        outputRange: ['110%', '140%'],
      })
    : '110%';
  const outerCircleWidth2 = scanning
    ? value.interpolate({
        inputRange: [0, 1],
        outputRange: ['120%', '180%'],
      })
    : '120%';

  const startScanning = async () => {
    await dispatch(resetAction());
    await dispatch(startScanningIOS());
  };

  //console.log('render');
  return (
    <>
    <MainHeader title="Scan" onMenuPress={() => navigation.openDrawer()} />
    <SafeAreaView style={[{backgroundColor: 'white',flex: 1, display: "flex"}]} edges={['left', "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.mainView}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: Dimensions.get('window').height > 600 ? 400 : 'auto',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={[styles.circle]}>
              <Animated.View style={[styles.outerCircle2, {width: outerCircleWidth2}]} />
              <Animated.View style={[styles.outerCircle1, {width: outerCircleWidth1}]} />
              <XiphooLogo width={'70%'} height={'70%'} />
            </View>
            {!scanning && (
              <Image
                resizeMode="contain"
                style={{
                  height: Dimensions.get('window').height * 0.12,
                  width: 'auto',
                  aspectRatio: 2.2,
                  marginTop: 25,
                }}
                source={Scan}
              />
            )}
            <View style={{alignItems: 'center', marginTop: scanning ? 30 : 0}}>
              <RootText fontWeight={700} style={mainStyles.mainTitle}>
                {scanning ? (tagDetected ? 'Tag detected...' : 'Scanning') : 'Start scanning'}
              </RootText>
              <RootText fontWeight={600} style={mainStyles.mainText}>
                {scanning
                  ? tagDetected
                    ? "Running verification... Don't move!"
                    : 'Please do not remove your device from the tag!'
                  : 'Hold your device to a XIPHOO tag to get further information and proof of authenticity.'}
              </RootText>
            </View>
          </View>
        </View>
        {!scanning && (
          <>
            {Platform.OS == "ios" && <MainButton onPress={startScanning}>
              <RootText style={mainStyles.buttonText}>Start scanning</RootText>
            </MainButton>}
            <View style={{height: 10}} />
            <MainButton onPress={() => navigation.navigate('HelpInfo')}>
              <RootText style={mainStyles.buttonText}>Help</RootText>
            </MainButton>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: Dimensions.get('window').height * 0.16,
    aspectRatio: 1,
    backgroundColor: CustomerTheme.colors['main-brown'],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    position: 'relative',
  },
  outerCircle1: {
    aspectRatio: 1,
    backgroundColor: CustomerTheme.colors['main-brown'] + '80',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    position: 'absolute',
  },
  outerCircle2: {
    aspectRatio: 1,
    backgroundColor: CustomerTheme.colors['main-brown'] + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    position: 'absolute',
  },
  mainView: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 16
  },
});


