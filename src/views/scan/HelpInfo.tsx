import React from 'react';
import {Dimensions, Image, StyleSheet, View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Scan} from '../../assets/images';
import MaxLength from '../../assets/svg/5cm.svg';
import {mainStyles} from '../../base/MainStyles';
import {CustomerTheme} from '../../base/Theme';
import {MainButton, MainHeader} from '../../components';
import {RootText} from '../../components/RootText';
import {MainStackParamList} from '../MainParamList';

export const HelpInfo = ({navigation}: MainStackParamList<'HelpInfo'>) => {
  return (
    <SafeAreaView style={[{backgroundColor: 'white', height: '100%'}]}>
      <MainHeader title="Information" onMenuPress={() => navigation.openDrawer()} />
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
              height: 'auto',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={{
                width: '100%',
                aspectRatio: 2.2,
                height: 'auto',
                marginTop: 25,
                marginRight: -60,
              }}
              source={Scan}
            />
            <MaxLength
              style={{
                width: '100%',
                aspectRatio: 2.2,
                height: 'auto',
                marginTop: 25,
                marginRight: -20,
              }}
            />
            <View style={{alignItems: 'center'}}>
              <RootText fontWeight={700} style={mainStyles.mainTitle}>
                Scan the NFC tag{'\n'}where marked
              </RootText>
              <RootText fontWeight={600} style={mainStyles.mainText}>
                Hold your smarthphone near to Xiphoo NFC tag. The distance between the NFC reader in your phone and the tag needs to be under 5 cm!
              </RootText>
            </View>
          </View>
        </View>
        <MainButton buttonStyle={{marginTop: 20}} onPress={() => navigation.navigate('Home')}>
          <RootText style={mainStyles.buttonText}>Start scanning</RootText>
        </MainButton>
      </ScrollView>
    </SafeAreaView>
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
  },
  mainView: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});
