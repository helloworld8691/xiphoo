import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import {CustomerTheme} from '../base/Theme';
import {RootText} from './RootText';
import {Dropdown} from './Dropdown';
import {DropdownElement} from './DropdownElement';
import {Product} from '../redux/productRegistration';
import {StateType} from '../redux/store';
import {useSelector} from 'react-redux';
import {SvgUri} from 'react-native-svg';

type scanPopupProps = {
  visible: boolean;
  onClosePress: () => void;
  result: {
    tagInfo: {
      xiphooTag: boolean;
      offlineCheck: boolean;
      onlineCheck: boolean;
      uid: string;
    };
    laps?: {tag: string; milliseconds: number; msSinceLastLap: number}[];
    product?: Product;
  };
  expanded?: boolean;
};

export const ScanningPopup = ({visible, onClosePress, result, expanded = false}: scanPopupProps) => {
  const {tagInfo, laps, product} = result;
  const loggedIn = !!useSelector((state: StateType) => state.auth.user);
  const productDetails = [
    {title: 'Brand Name: ', text: product?.brandName},
    {title: 'Product Name: ', text: product?.productName},
    {title: 'Color Name: ', text: product?.colorName},
    {title: 'Size Name: ', text: product?.sizeName},
    {title: 'Gender: ', text: product?.productDetails?.gender},
    {title: `SKU: `, text: product?.productDetails?.sku},
    {title: `EAN: `, text: product?.productDetails?.ean},
    {title: `Category: `, text: product?.productDetails?.category},
    {title: `Sub Category: `, text: product?.productDetails?.subCategory},
    {title: `Category 3: `, text: product?.productDetails?.furtherSubCategory},
    {title: `Origin: `, text: product?.productDetails?.origin},
    {title: `Year: `, text: product?.productDetails?.year},
    {title: `Description: `, text: product?.productDetails?.description},
  ];
  return (
    <Modal
      style={[{justifyContent: 'flex-end', alignItems: 'stretch', width: '100%', margin: 0}]}
      useNativeDriver={true}
      isVisible={visible}
      onBackButtonPress={onClosePress}
      onBackdropPress={onClosePress}>
      <View style={{...styles.modal}}>
        <ScrollView contentContainerStyle={{padding: 20}} style={{width: '100%'}}>
          <RootText style={styles.title}>Scanning Details</RootText>
          <View style={{width: '100%'}}>
            <Dropdown title="Authenticity" selected={true} onSelectedPress={() => {}} initialState={expanded}>
              <DropdownElement selected={result.tagInfo.xiphooTag} text="Xiphoo Tag" />
              <DropdownElement selected={result.tagInfo.offlineCheck} text="Offline Check" />
              <DropdownElement selected={result.tagInfo.onlineCheck} text="Online Check" />
            </Dropdown>
            <Dropdown title="Product Details" selected={true} onSelectedPress={() => { }}>
              {productDetails.filter(p => p.text).map((p, i) =>
                <TableEntry key={p.title} dark={i%2==0} leftText={p.title} rightText={p.text as string} />
              )}
            </Dropdown>
            {(product?.productDetails?.components?.length ?? 0 > 0) && (
              <Dropdown title="Materials" selected={true} onSelectedPress={() => {}}>
                {product?.productDetails?.components?.map((c, i) => (
                  <TableEntry dark={i % 2 == 0} leftText={`${c.name}: `} rightText={c.materials.map((v) => `${v.name}: ${v.amount}%`).join(', ')} key={`${c.name}`} />
                ))}
              </Dropdown>
            )}
            {product?.productDetails?.laundry && (
              <Dropdown title="Washing instructions" selected={true} onSelectedPress={() => {}}>
                {Object.entries(product?.productDetails?.laundry)
                  .filter(([_, val]) => val !== undefined)
                  .map(([key, val], i) => (
                    <TableEntry dark={i % 2 == 0} key={key} leftText={`${key.replace(/^([a-z])/, ($1: string) => $1.toUpperCase())}: `} rightText={val!.text} icon={val!.symbol} />
                  ))}
              </Dropdown>
            )}
            {result.laps && loggedIn && (
              <Dropdown title="Scanning Details" selected={true} onSelectedPress={() => {}} initialState={expanded}>
                <View style={{width: '100%', backgroundColor: 'white', display: 'flex', flexDirection: 'column'}}>
                  <TableEntry dark leftText={`uid: `} rightText={tagInfo.uid.toUpperCase()} />
                  {[...result.laps, {tag: 'Total', msSinceLastLap: result.laps[result.laps.length - 1].milliseconds}].map((l, i) => (
                    <TableEntry key={l.tag} dark={i % 2 == 1} leftText={`${l.tag}: `} rightText={`${l.msSinceLastLap}ms`} />
                  ))}
                </View>
              </Dropdown>
            )}
          </View>
          <View style={{width: '100%', backgroundColor: 'white'}}>
            <TouchableOpacity style={{alignSelf: 'center', marginTop: 40}} onPress={onClosePress} activeOpacity={0.7}>
              <View style={styles.closeButton}>
                <FontAwesomeIcon color="white" icon={faTimes} size={18} />
              </View>
              <RootText style={{color: CustomerTheme.colors['main-gray']}} fontWeight={700}>
                Close
              </RootText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'flex-start',
    height: 'auto',
    backgroundColor: 'white',
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    color: CustomerTheme.colors['main-gray'],
  },
  closeButton: {
    borderRadius: 100,
    backgroundColor: CustomerTheme.colors['main-brown'],
    height: 42,
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function TableEntry({dark = false, leftText, rightText, icon}: {leftText: string; rightText: string; dark?: boolean; icon?: string}): JSX.Element {
  return (
    <View
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: dark ? '#0001' : 'transparent',
        paddingHorizontal: 15,
        paddingVertical: 3,
        flexWrap: 'wrap',
      }}>
      <RootText style={{flexGrow: 1, marginRight: 20}}>{leftText}</RootText>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', flexGrow: 1}}>
        <RootText style={{textAlign: 'right'}}>{rightText}</RootText>
        {icon && (
          <View style={{width: 24, height: 24, aspectRatio: 1, marginLeft: 10}}>
            <SvgUri width="100%" height="100%" uri={icon} preserveAspectRatio="true" />
          </View>
        )}
      </View>
    </View>
  );
}
