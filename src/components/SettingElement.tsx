import React from 'react';
import {StyleSheet, Switch, TouchableOpacity, View} from 'react-native';
import {CustomerTheme} from '../base/Theme';
import {RootText} from './RootText';

type ElementProps = {
  title: string;
  text: string;
  switched: boolean;
  onChange: (change: boolean) => void;
  disabled?: boolean;
};

export const SettingElement = ({title, text, onChange, switched, disabled}: ElementProps) => {
  return (
    <TouchableOpacity onPress={() => onChange(!switched)} activeOpacity={0.7} style={[styles.buttton, {backgroundColor: '#EFEFEF'}]}>
      <View pointerEvents="box-none">
        <Switch disabled={disabled} value={switched} onValueChange={() => onChange(!switched)} />
      </View>
      <View style={{flex: 1}}>
        <RootText
          fontWeight={600}
          style={{
            color: CustomerTheme.colors['main-gray'],
          }}>
          {title}
        </RootText>
        <RootText style={{color: CustomerTheme.colors['main-gray']}}>{text}</RootText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttton: {
    flexDirection: 'row-reverse',
    borderRadius: 10,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
});
