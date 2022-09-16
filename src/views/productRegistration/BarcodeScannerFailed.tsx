import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {CustomerTheme} from '../../base/Theme';
import {MainButton, MainHeader, MainTextInput} from '../../components';
import {RootText} from '../../components/RootText';
import {fetchProduct, resetAction} from '../../redux/productRegistration';
import {StateType} from '../../redux/store';
import {MainStackParamList} from '../MainParamList';

export const BarcodeScannerFailed = ({navigation, route}: MainStackParamList<'BarcodeFailed'>) => {
  const [barcode, setBarcode] = useState('');

  const {settings} = useSelector((state: StateType) => state.settings);

  const dispatch = useDispatch();

  const reset = () => {
    dispatch(resetAction());
  };

  return (
    <SafeAreaView style={[{backgroundColor: 'white', height: '100%'}]}>
      <MainHeader title="Product Registration" onMenuPress={() => navigation.openDrawer()} />
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
              width: '90%',
            }}>
            <TouchableOpacity style={styles.circle} onPress={() => navigation.navigate('ProductRegistration')} /*TODO: Remove all Touchable Opacitys on circles */>
              <FontAwesomeIcon icon={faExclamationTriangle} color={"white"} size={44} style={{marginBottom: 4}} />
            </TouchableOpacity>
            <RootText fontWeight={700} style={styles.errorTitle}>
              No product found with this barcode
            </RootText>
            {/* <View style={{width: '100%'}}>
              <MainTextInput
                inputStyle={{textAlign: 'center'}}
                onSubmitEditing={(e) => dispatch(fetchProduct(barcode))}
                value={barcode}
                placeholder="Please enter barcode"
                onTextChange={(value) => setBarcode(value)}
              />
            </View> */}
          </View>
        </View>
        <MainButton onPress={reset}>
          <RootText style={{color: 'white'}}>Retry scanning</RootText>
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
  errorTitle: {
    fontSize: 20,
    color: CustomerTheme.colors['error-red'],
    textAlign: 'center',
    marginBottom: 14,
  },
});
