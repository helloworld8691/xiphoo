import React, {useEffect, useState} from 'react';
import {Button, Dimensions, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Configuration, DefaultApi} from '../../api';
import ScanIcon from '../../assets/svg/barcode-read-solid.svg';
import {CustomerTheme} from '../../base/Theme';
import {MainHeader, MainTextInput} from '../../components';
import {MainStackParamList} from '../MainParamList';
import {StateType} from '../../redux/store';

import ZebraScanner from 'react-native-zebra-scanner';
import {fetchProduct} from '../../redux/productRegistration';



export const BarcodeScanner = ({navigation, route}: MainStackParamList<'BarcodeScanner'>) => {
  const [barcode, setBarcode] = useState('');

  const {user} = useSelector((state: StateType) => state.auth);

  const {settings} = useSelector((state: StateType) => state.settings);

  const dispatch = useDispatch();
  useEffect(() => {
    if (settings.hasDedicatedScannerHardware) {
      const listener: ZebraScanner.callBack = (code) => {
        setBarcode(code)
        dispatch(fetchProduct(code));
      };
      ZebraScanner.addScanListener(listener);
      return () => {
        try {
          ZebraScanner.removeScanListener(listener);
        }
        catch { }
      };
    }
  }, []);

  return (
    <SafeAreaView style={[{backgroundColor: 'white', height: '100%'}]}>
      <MainHeader title="Product Registration" onMenuPress={() => navigation.openDrawer()} />
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
              width: '90%',
            }}>
            <TouchableOpacity style={styles.circle} onPress={() => navigation.navigate('BarcodeFailed')}>
              <ScanIcon width={'50%'} height={'50%'} />
            </TouchableOpacity>
            <View style={{width: '100%'}}>
              <MainTextInput
                inputStyle={{textAlign: 'center'}}
                onSubmitEditing={(e) => dispatch(fetchProduct(barcode))}
                value={barcode}
                placeholder="Please enter barcode"
                onTextChange={(value) => setBarcode(value)}
              />
            </View>
          </View>
        </View>
      </View>
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
    marginBottom: 18,
  },
  mainView: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: CustomerTheme.colors['main-gray'],
    marginTop: 14,
  },
  text: {
    fontSize: 15,
    color: CustomerTheme.colors['main-gray'],
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 315,
  },
});
