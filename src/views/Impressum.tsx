import React from 'react';
import {Linking, ScrollView, StatusBar, StatusBarIOS, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomerTheme} from '../base/Theme';
import {MainButton, MainHeader} from '../components';
import {RootText} from '../components/RootText';
import { MainStackParamList } from './MainParamList';
import { getBuildNumber, getVersion } from "react-native-device-info";
import { DefaultTheme } from '@react-navigation/native';


export const Impressum = ({navigation, route}: MainStackParamList<'Impressum'>) => {
  return (
    <>
    <MainHeader title="Information" onMenuPress={() => navigation.openDrawer()} />
    <SafeAreaView style={[{backgroundColor: 'white', height: '100%'}]} edges={['left', "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.mainView}>
        <RootText style={{color: CustomerTheme.colors['main-gray'], opacity: 0.8, marginBottom: 16}}>About us</RootText>
        <RootText style={styles.description}>
          XIPHOO is a platform for brands/manufacturers and retailers to connect with end customers, utilizing NFC tags proving the authenticity of products, enabling direct and product-related
          marketing, and optimizing the product life cycle from production to recycling. The end customer needs to install only a single app for various brands due to our universal and open platform
          approach.{'\n'}
          {'\n'}Start the walk - let the product talk
        </RootText>
        <MainButton buttonStyle={{marginBottom: 12}} onPress={() => Linking.openURL('https://www.xiphoo.com/')}>
          <RootText style={{color: 'white'}}>Visit our Website</RootText>
        </MainButton>
        <MainButton buttonStyle={{marginBottom: 12}} onPress={() => Linking.openURL('https://www.xiphoo.com/')}>
          <RootText style={{color: 'white'}}>Licences</RootText>
        </MainButton>
          <RootText style={{ color: DefaultTheme.colors.text, marginVertical: 20 }}>Version {getVersion() + " (" + getBuildNumber() + ")"}</RootText>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: CustomerTheme.colors['main-gray'],
    marginTop: 18,
  },
  text: {
    fontSize: 16,
    color: CustomerTheme.colors['main-gray'],
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    backgroundColor: CustomerTheme.colors['bg-gray-light'],
    padding: 14,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
});
