import React from 'react';
import {Text, StyleProp, TextStyle, Platform} from 'react-native';

type RootFontProps = {
  fontFamily?: 'Gordita';
  style?: StyleProp<TextStyle>;
  children: any;
  fontWeight?: 500 | 600 | 700;
};

function getFontWeight(fontWeight: 500 | 600 | 700 | undefined) {
  switch (fontWeight) {
    case 500:
      if (Platform.OS == 'android') {
        return 'Type Atelier - Gordita';
      } else if (Platform.OS == 'ios') {
        return 'Gordita';
      }    case 600:
      if (Platform.OS == 'android') {
        return 'Type Atelier - Gordita Medium';
      } else if (Platform.OS == 'ios') {
        return 'Gordita';
      }
    case 700:
      if (Platform.OS == 'android') {
        return 'Type Atelier - Gordita Bold';
      } else if (Platform.OS == 'ios') {
        return 'Gordita';
      }
    default:
      if (Platform.OS == 'android') {
        return 'Type Atelier - Gordita';
      } else if (Platform.OS == 'ios') {
        return 'Gordita';
      }
  }
}

export const RootText = ({style, fontWeight, children}: RootFontProps) => {
  return <Text style={[{fontFamily: getFontWeight(fontWeight)}, style]}>{children}</Text>;
};
