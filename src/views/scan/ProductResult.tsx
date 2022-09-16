import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Dimensions, Image, Platform, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MainButton, MainHeader} from '../../components';
import {ScanningPopup} from '../../components/ScanningPopup';
import {MainStackParamList} from '../MainParamList';
import {CustomerTheme} from '../../base/Theme';
import {RootText} from '../../components/RootText';
import {StateType} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {resetAction, resetActionSoft} from '../../redux/scanProduct';
import {WebView} from 'react-native-webview';
import nfcManager, {NfcEvents} from 'react-native-nfc-manager';
import {useFocusEffect} from '@react-navigation/core';

export const ProductResult = ({navigation, route}: MainStackParamList<'ProductResult'>) => {
  const {result} = useSelector((state: StateType) => state.scanProduct);
  const dispatch = useDispatch();
  const {tagInfo, product, laps} = result!;

  const {brandLogo, brandName, colorName, productImage, productName, sizeName} = product ?? {};


  const {ean, category,sku, description, gender, subCategory} = product?.productDetails ?? {};


  const [popupVisible, setPopupVisible] = useState(false);
  const tryAgain = () => {
    dispatch(resetActionSoft());
  };

  const webViewCanGoBack = useRef<boolean>(false);
  const webViewRef = useRef<WebView>(null);

  const handleBackButton = () => {
    if (webViewCanGoBack.current && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      dispatch(resetActionSoft());
    }
    return true;
  };

  useFocusEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  });



  var productLink = "";


if(product?.productURL != null && product?.productURL != "")
{
   productLink = product.productURL;
   productLink += "?brand_name="+brandName;
   productLink += "&brand_img="+brandLogo;
   productLink += "&color="+colorName;
   productLink += "&product_img="+productImage;
   productLink += "&product_name="+productName;
   productLink += "&size="+sizeName;
   productLink += "&ean="+ean;
   productLink += "&sku="+sku;
   productLink += "&description="+description;
   productLink += "&gender="+gender;
   productLink += "&category="+category;
   productLink += "&subCategory="+subCategory;

}


  return (
    <>
      <MainHeader showXiphooPatch productIsOriginal={tagInfo} onMenuPress={() => (navigation as any).openDrawer()} onProductPress={() => setPopupVisible(true)} />
      <SafeAreaView style={[{backgroundColor: 'white', height: Dimensions.get('window').height}]} edges={['left', 'right', 'bottom']}>
        {product?.productURL ? (
          <WebView
            ref={webViewRef}
            source={{uri: productLink}}
            onNavigationStateChange={(e) => {
              webViewCanGoBack.current = e.canGoBack;
            }}
            style={{flex: 1, marginBottom: 100}}
            renderLoading={() => <RootText style={{color: 'black', fontSize: 30, fontWeight: '700', alignSelf: 'center', textAlignVertical: 'center', flex: 1}}>Loading...</RootText>}
            startInLoadingState
          />
        ) : (
          <ScrollView contentContainerStyle={{padding: 20}} style={{height: '100%'}}>
            <View style={styles.mainView}>

              {brandName && (
                <RootText fontWeight={700} style={styles.productTitle} /* TODO: Implement Product Data */>
                  {brandName}
                </RootText>
              )}
              {productName && (
                <RootText fontWeight={700} style={styles.productSubtitle}>
                  {productName}
                </RootText>
              )}
              {colorName && (
                <RootText fontWeight={600} style={styles.productInformation}>
                  Farbe: {colorName}
                </RootText>
              )}
              {sizeName && (
                <RootText fontWeight={600} style={styles.productInformation}>
                  Größe: {sizeName}
                </RootText>
              )}
                 {brandLogo && <Image resizeMode="contain" style={styles.productLogo} source={{uri: brandLogo, cache: 'default'}} />}
                            {productImage && <Image resizeMode="contain" style={styles.productImage} source={{uri: productImage, cache: 'default'}} />}
              <View style={{height: 40}} />
              <MainButton onPress={tryAgain}>
                <RootText style={{color: 'white'}}>Scan again</RootText>
              </MainButton>
            </View>
          </ScrollView>
        )}
        <ScanningPopup visible={popupVisible} result={{tagInfo: tagInfo, laps, product}} onClosePress={() => setPopupVisible(false)} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
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
