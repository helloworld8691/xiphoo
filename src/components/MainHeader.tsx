import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CustomerTheme} from '../base/Theme';
import {RootText} from './RootText';
import XiphooLogoWhite from '../assets/svg/logo_white.svg';
import {ProductCheck} from './ProductCheck';
import {SuccessObject} from '../lib/SuccessObject';
import { SafeAreaView } from 'react-native-safe-area-context';

type headerProps = {
  backgroundColor?: string;
  onMenuPress: () => void;
  title?: string;
  showXiphooPatch?: boolean;
  productIsOriginal?: SuccessObject | undefined;
  onProductPress?: () => void;
};

export const MainHeader = ({backgroundColor = CustomerTheme.colors['main-gray'], onMenuPress, title, showXiphooPatch, productIsOriginal, onProductPress}: headerProps) => {
  return (
    <SafeAreaView style={[{backgroundColor: backgroundColor}]} edges={['left', "right", "top"]}>
      <View style={[styles.header, {backgroundColor: backgroundColor, position: 'relative'}]}>
        <StatusBar backgroundColor={backgroundColor} />
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButtonCon}>
          <View style={styles.menuButton}>
            <FontAwesomeIcon color="white" icon={faBars} size={19} />
          </View>
        </TouchableOpacity>
        {title && (
          <RootText fontWeight={700} style={styles.title}>
            {title}
          </RootText>
        )}
        {productIsOriginal != undefined && <ProductCheck onPress={onProductPress} isOriginal={productIsOriginal} />}
        {showXiphooPatch && (
          <View style={styles.xiphooPatch}>
            <XiphooLogoWhite width={'70%'} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButtonCon: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 1,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: '#ffffff10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xiphooPatch: {
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 10,
    backgroundColor: CustomerTheme.colors['main-brown'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
});
