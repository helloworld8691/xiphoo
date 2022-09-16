import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, View, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {CustomerTheme} from '../../base/Theme';
import {InformationPopup, MainButton, MainHeader, ScanPopup} from '../../components';
import {RootText} from '../../components/RootText';
import {StateType} from '../../redux/store';
import {MainStackParamList} from '../MainParamList';
import {resetAction} from '../../redux/productRegistration';
import {resetAction as scanningResetAction} from '../../redux/scanProduct';
import {useProductWrite} from './useProductWrite';

export const ProductRegistration = ({navigation, route}: MainStackParamList<'ProductRegistration'>) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const {product} = useSelector((state: StateType) => state.productRegistration);
  const dispatch = useDispatch();
  const {brandLogo, brandName, colorName, productImage, productName, sizeName,productDetails,sku,ean,code,gender} = product!;
  //console.log('🚀 ~ file: ProductRegistration.tsx ~ line 20 ~ ProductRegistration ~ product', product);
  let {writeTag, successType, reset, errorMessage, active} = useProductWrite();
  //console.log('🚀 ~ file: ProductRegistration.tsx ~ line 93 ~ ProductRegistration ~ successType', successType);

  const startWriting = () => { 
    if (successType != 'writing') writeTag();
  };

  const resetState = () => { 
    reset();
    dispatch(resetAction());
  };

  useEffect(() => {
    dispatch(scanningResetAction())
  }, [])


  return (
    <SafeAreaView style={[{backgroundColor: 'white', height: '100%',padding: 0}]}>
      <MainHeader title="Product Registration" onMenuPress={() => {navigation.openDrawer();reset()}} onProductPress={() => reset()} />
      <ScrollView contentContainerStyle={{padding: 0,margin:0}} style={{height: '100%'}}>
        <View style={{padding: 0, paddingTop: 0,margin:0}}>
          <View style={styles.mainView}>

<View style={{ flex:1, alignSelf:'stretch',flexDirection:'row', backgroundColor:'#ccc', padding:3}}>
 <View style={{ flex: 1, alignSelf: 'stretch',textAlign:'left' }} >
 <RootText>Brand Name:</RootText>
 </View>
 <View style={{ flex: 1 ,alignSelf: 'stretch', textAlign:'right'}} >
 <RootText>{brandName}</RootText>
 </View>
</View>

<View style={{ flex:1, alignSelf:'stretch',flexDirection:'row', backgroundColor:'#fff', padding:3}}>
 <View style={{ flex: 1, alignSelf: 'stretch',textAlign:'left' }} >
 <RootText>Product Number:</RootText>
 </View>
 <View style={{ flex: 1 ,alignSelf: 'stretch', textAlign:'right'}} >
 <RootText>{sku}</RootText>
 </View>
</View>

<View style={{ flex:1, alignSelf:'stretch',flexDirection:'row', backgroundColor:'#ccc', padding:3}}>
 <View style={{ flex: 1, alignSelf: 'stretch',textAlign:'left' }} >
 <RootText>Product Name:</RootText>
 </View>
 <View style={{ flex: 1 ,alignSelf: 'stretch', textAlign:'right'}} >
 <RootText>{productName}</RootText>
 </View>
</View>

<View style={{ flex:1, alignSelf:'stretch',flexDirection:'row', backgroundColor:'#fff', padding:3}}>
 <View style={{ flex: 1, alignSelf: 'stretch',textAlign:'left' }} >
 <RootText>Color Number:</RootText>
 </View>
 <View style={{ flex: 1 ,alignSelf: 'stretch', textAlign:'right'}} >
 <RootText>{code}</RootText>
 </View>
</View>

<View style={{ flex:1, alignSelf:'stretch',flexDirection:'row', backgroundColor:'#ccc', padding:3}}>
 <View style={{ flex: 1, alignSelf: 'stretch',textAlign:'left' }} >
 <RootText>Color Name:</RootText>
 </View>
 <View style={{ flex: 1 ,alignSelf: 'stretch', textAlign:'right'}} >
 <RootText>{colorName}</RootText>
 </View>
</View>

<View style={{ flex:1, alignSelf:'stretch',flexDirection:'row', backgroundColor:'#fff', padding:3}}>
 <View style={{ flex: 1, alignSelf: 'stretch',textAlign:'left' }} >
 <RootText>Size Name:</RootText>
 </View>
 <View style={{ flex: 1 ,alignSelf: 'stretch', textAlign:'right'}} >
 <RootText>{sizeName}</RootText>
 </View>
</View>

<View style={{ flex:1, alignSelf:'stretch',flexDirection:'row', backgroundColor:'#ccc', padding:3}}>
 <View style={{ flex: 1, alignSelf: 'stretch',textAlign:'left' }} >
 <RootText>Gender:</RootText>
 </View>
 <View style={{ flex: 1 ,alignSelf: 'stretch', textAlign:'right'}} >
 <RootText>{gender}</RootText>
 </View>
</View>

<View style={{ flex:1, alignSelf:'stretch',flexDirection:'row', backgroundColor:'#fff', padding:3}}>
 <View style={{ flex: 1, alignSelf: 'stretch',textAlign:'left' }} >
 <RootText>EAN:</RootText>
 </View>
 <View style={{ flex: 1 ,alignSelf: 'stretch', textAlign:'right'}} >
 <RootText>{ean}</RootText>
 </View>
</View>


{/*
                <Image resizeMode="contain" style={styles.productLogo} source={{uri: brandLogo, cache: 'default'}} />
             */}
                        <Image resizeMode="contain" style={styles.productImage} source={{uri: productImage, cache: 'default'}} />
          </View>
        </View>
      </ScrollView>
      <View style={{display: 'flex', flexDirection: "row", paddingHorizontal: 10, paddingVertical: 20}}>
        <MainButton onPress={resetState} buttonStyle={{width: "auto", flex: 1}} bgColor={CustomerTheme.colors['error-red']}>
          <RootText style={{color: 'white'}}>Retry scanning</RootText>
        </MainButton>
        <View style={{ width: 10 }}/>
        <MainButton onPress={startWriting} buttonStyle={{width: "auto", flex: 1}} bgColor={CustomerTheme.colors['main-green']}>
          <RootText style={{color: 'white'}}>Register tag</RootText>
        </MainButton>
      </View>
      <ScanPopup writing={successType == 'writing'} scanning={successType == 'writing' || successType == 'initial'} visible={active} onClosePress={() => reset()} />
      <InformationPopup
        noBackdrop
        title="Error writing Tag"
        onClosePress={reset}
        actions={[
          {buttonText: 'Try Again', onButtonPress: startWriting},
          // {buttonText: 'Close', onButtonPress: reset},
        ]}
        description={(typeof errorMessage !== "string" ? "The distance between the phone and tag needs do be under 5cm!\n" : "")+'Error Message: ' + JSON.stringify(errorMessage)}
        type="error"
        visible={successType == 'error'}
      />
      <InformationPopup
        noBackdrop
        title="Tag written successfully"
        description=""
        actions={[
          {buttonText: 'Same product, next tag', onButtonPress: startWriting, bg: CustomerTheme.colors['main-green']},
          { buttonText: 'New Product', onButtonPress: resetState, bg: CustomerTheme.colors['error-red'] },
          // {buttonText: 'Close', onButtonPress: reset},
        ]}
        onClosePress={reset}
        type="success"
        visible={successType == 'success'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  productLogo: {
    height: 100,
    width: '100%',
  },
  productImage: {
    height: 250,
    aspectRatio: 1,
    maxWidth: '100%',
  },
  productTitle: {
    fontSize: 24,
    textAlign: 'center',
    color: CustomerTheme.colors['main-gray'],
  },
  productSubtitle: {
    textAlign: 'center',
    color: CustomerTheme.colors['main-gray'],
    fontSize: 18,
    marginBottom: 2,
  },
  productInformation: {
    textAlign: 'center',
    color: CustomerTheme.colors['light-grey'],
    fontSize: 16,
  },
});
