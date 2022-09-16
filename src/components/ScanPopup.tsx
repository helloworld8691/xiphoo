import React, {useEffect, useState} from 'react';
import {Dimensions, LayoutAnimation, Platform, StyleSheet, View, UIManager, TouchableOpacity, Animated} from 'react-native';
import Modal from 'react-native-modal';
import {CustomerTheme} from '../base/Theme';
import XiphooLogo from '../assets/svg/logo_white.svg';
import {RootText} from './RootText';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import { useAnimation } from "../hooks/useAnimation";

type scanPopupProps = {
  visible: boolean;
  onClosePress: () => void;
  writing: boolean;
  scanning: boolean;
};

export const ScanPopup = ({visible, onClosePress, writing, scanning}: scanPopupProps) => {
  const value = useAnimation(scanning);

  const outerCircleWidth1 = scanning
    ? value.interpolate({
        inputRange: [0, 1],
        outputRange: ['110%', '130%'],
      })
    : '110%';
  const outerCircleWidth2 = scanning
    ? value.interpolate({
        inputRange: [0, 1],
        outputRange: ['120%', '160%'],
      })
    : '120%';

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  return (
    <Modal
      style={[{justifyContent: 'flex-end', alignItems: 'stretch', margin: 0}]}
      isVisible={visible}
      hasBackdrop={true}
      backdropOpacity={0.3}
      onBackButtonPress={onClosePress}
      onBackdropPress={onClosePress}
      animationInTiming={550}
      animationOutTiming={750}>
      <View style={{...styles.modal}}>
        <View style={{right: 10, top: 10, position: 'absolute'}}>
          <TouchableOpacity onPress={onClosePress} hitSlop={{bottom: 40, left: 40, top: 40, right: 40}}>
            <FontAwesomeIcon color={CustomerTheme.colors['main-gray']} icon={faTimes} size={18} />
          </TouchableOpacity>
        </View>
        <View style={[styles.circle]}>
          <Animated.View style={[styles.outerCircle2, {width: outerCircleWidth2}]} />
          <Animated.View style={[styles.outerCircle1, {width: outerCircleWidth1}]} />
          <XiphooLogo width={'70%'} height={'70%'} />
        </View>
        <RootText fontWeight={600} style={styles.popupTitle}>
          {writing ? 'Writing...' : 'Hold device near the tag to start writing'}
        </RootText>
        <RootText style={styles.popupText}>{writing ? 'Stay within 5cm!' : 'The distance between the device and tag needs to be under 5cm!'}</RootText>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    height: 'auto',
    backgroundColor: 'white',
    maxHeight: '100%',
    width: '100%',
    padding: 16,
    elevation: 10,
  },
  circle: {
    marginTop: 20,
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
  popupTitle: {
    fontSize: 16,
    marginTop: 30,
    color: CustomerTheme.colors['main-brown'],
    textAlign: 'center',
  },
  popupText: {
    textAlign: 'center',
    color: CustomerTheme.colors['light-grey'],
    fontSize: 14,
    marginTop: 8,
  },
});
