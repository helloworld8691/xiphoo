import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {CustomerTheme} from '../base/Theme';
import {InformationPopup, MainHeader} from '../components';
import {RootText} from '../components/RootText';
import {SettingElement} from '../components/SettingElement';
import {updateSettings} from '../redux/settings';
import {StateType} from '../redux/store';
import {MainStackParamList} from './MainParamList';

export const Settings = ({navigation, route}: MainStackParamList<'Settings'>) => {
  const {audioWarnings, autoBarcodeRead, autoWrite} = useSelector((state: StateType) => state.settings.settings);
  const dispatch = useDispatch();

  const setAudioOn = (on: boolean) => {
    dispatch(updateSettings({audioWarnings: on}));
  };
  const setAutoRead = (on: boolean) => {
    dispatch(updateSettings({autoBarcodeRead: on}));
  };
  const setAutoWrite = (on: boolean) => {
    dispatch(updateSettings({autoWrite: on}));
  };

  const [showInfoPopup, setShowInfoPopup] = useState(false);

  return (
    <SafeAreaView style={[{backgroundColor: 'white', height: '100%'}]}>
      <MainHeader title="Settings" onMenuPress={() => navigation.openDrawer()} />
      <View style={styles.mainView}>
        <RootText style={{color: CustomerTheme.colors['main-gray'], opacity: 0.8}}>General</RootText>
        <SettingElement
          onChange={(c) => {
            setAudioOn(c), setShowInfoPopup(true);
          }}
          title="Audio Warnings"
          text="For all Notifications"
          switched={audioWarnings}
        />
        <RootText style={{color: CustomerTheme.colors['main-gray'], opacity: 0.8, marginTop: 12}}>Registration</RootText>
        <SettingElement onChange={(c) => setAutoRead(c)} title="Auto Barcode read" text="Auto-open barcode reader" switched={autoBarcodeRead} />
        <SettingElement onChange={(c) => setAutoWrite(c)} title="Auto write" text="Auto-write on valid barcode" switched={autoWrite} />
      </View>
      <InformationPopup timer={2000} type="success" title="Success" description="Setting was changed successfully!" visible={showInfoPopup} onClosePress={() => setShowInfoPopup(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: Dimensions.get('window').height * 0.18,
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
});
