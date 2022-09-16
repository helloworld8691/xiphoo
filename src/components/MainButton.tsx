import React, {ReactChild, ReactNode} from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {CustomerTheme} from '../base/Theme';

type buttonProps = {
  buttonStyle?: StyleProp<ViewStyle>;
  children: ReactChild | ReactNode;
  onPress: () => void;
  bgColor?: string;
  disabled?: boolean;
};

export const MainButton = ({
  bgColor = CustomerTheme.colors['main-brown'],
  buttonStyle,
  children,
  onPress,
  disabled
}: buttonProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.button, buttonStyle, {backgroundColor: bgColor}]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '100%',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
