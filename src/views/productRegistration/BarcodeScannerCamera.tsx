import React, {useRef, useState} from 'react';
import {Text, View, StyleSheet, Dimensions, Button, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomerTheme} from '../../base/Theme';
import '../../redux/auth/thunk';

import {RNCamera, Constants} from 'react-native-camera';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {MainButton, MainHeader, MainTextInput} from '../../components';
import {RootText} from '../../components/RootText';
import ScanIcon from '../../assets/svg/barcode-read-solid.svg';
import {StateType} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {MainStackParamList} from '../MainParamList';
import {fetchProduct} from '../../redux/productRegistration';

export const BarcodeScannerCamera = ({navigation, route}: MainStackParamList<'Home'>) => {
  const [tochOn, setTochOn] = useState(false);

  const {fetching} = useSelector((state: StateType) => state.productRegistration);
  const dispatch = useDispatch();
  const [code, setCode] = useState('');


  const width = Dimensions.get('window').width * 0.6,
    height = (width * 4) / 3;

  const gotCode = (code: string) => {
    if (!fetching.fetchProduct.fetching) {
      setCode(code);
      dispatch(fetchProduct(code));
    }
  };

  return (
    <SafeAreaView style={[{backgroundColor: 'white', height: '100%'}]}>
      <MainHeader title="Product registration" onMenuPress={() => navigation.openDrawer()} />
      <ScrollView contentContainerStyle={styles.mainView}>
        <View style={styles.circle}>
          <ScanIcon width={'50%'} height={'50%'} />
        </View>
        <RNCamera
          style={{
            width,
            height,
            overflow: 'hidden',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          ratio={'4:3'}
          cameraViewDimensions={{
            width,
            height,
          }}
          flashMode={tochOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            for (const barcode of barcodes) {
              if (barcode.data && barcode.type != 'UNKNOWN_FORMAT') {
                // setCode(barcode.data);
                gotCode(barcode.data);
                //console.log(barcode.data, barcode.type, barcode.title, barcode.dataRaw);
              }
            }
          }}
          // torchMode={torchOn ? Camera.constants.TorchMode.on : Camera.constants.TorchMode.off}
          // onBarCodeRead={onBarCodeRead}
          // ref={camRef}
        >
          <View
            style={{
              backgroundColor: '#0009',
              width: '80%',
              height: '40%',
              justifyContent: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#900',
                width: '100%',
                height: 4,
              }}
            />
          </View>
        </RNCamera>
        <View style={{width: '100%', marginTop: 10}}>
          <MainTextInput
            inputStyle={{textAlign: 'center'}}
            onSubmitEditing={(e) => dispatch(fetchProduct(code))}
            value={code}
            placeholder="Please enter barcode"
            onTextChange={(value) => setCode(value)}
          />
        </View>
        <MainButton onPress={() => setTochOn(!tochOn)}>
          <RootText fontWeight={600} style={{color: 'white'}}>
            Toggle Torch
          </RootText>
        </MainButton>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: Dimensions.get('window').height * 0.1,
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});
