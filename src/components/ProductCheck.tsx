import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {CustomerTheme} from '../base/Theme';
import {SuccessObject} from '../lib/SuccessObject';

type productCheckProps = {
  isOriginal: SuccessObject;
  onPress?: () => void;
};

export const ProductCheck = ({onPress, isOriginal}: productCheckProps) => {
  const isOriginalBool = isOriginal.offlineCheck && isOriginal.onlineCheck && isOriginal.xiphooTag;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.productCheckCon, {backgroundColor: isOriginalBool ? CustomerTheme.colors['main-green'] : CustomerTheme.colors['error-red']}]}>
      {/* <Text style={{color: 'white'}}>{isOriginalBool ? 'Product is original' : isOriginal.offlineCheck?'Verification partially failed': 'Verification failed'}</Text> */}
      <Text style={{color: 'white'}}>Product info</Text>
      <FontAwesomeIcon style={{marginLeft: 8}} icon={isOriginalBool ? faCheck : faTimes} color="white" size={13} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCheckCon: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
