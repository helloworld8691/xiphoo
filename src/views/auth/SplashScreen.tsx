import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import XiphooLogo from '../../assets/svg/xiphoo_logo.svg';
import {CustomerTheme} from '../../base/Theme';
import {RootText} from '../../components/RootText';

export const SplashScreen = ({navigation}: any) => {
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: CustomerTheme.colors['main-gray'],
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
      ]}>
      <StatusBar backgroundColor={CustomerTheme.colors['main-gray']} />
      <View
        style={[
          styles.circle,
          {
            width: '115%',
            height: 'auto',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 90,
            aspectRatio: 1,
          },
        ]}>
        <View
          style={[
            styles.circle,
            {
              width: '78%',
              height: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: 1,
            },
          ]}>
          <XiphooLogo
            width={'75%'}
            onPress={() => {
              navigation.navigate('Main');
            }}
          />
        </View>
      </View>
      <RootText style={styles.bottomText}>(c) Xiphoo</RootText>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#ffffff10',
    borderRadius: 1000,
  },
  bottomText: {
    position: 'absolute',
    bottom: 16,
    fontSize: 20,
    color: '#ffffff50',
  },
});
