import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {KeyboardType, StyleProp, StyleSheet, TextInput, TextStyle, TextInputProps, View, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {CustomerTheme} from '../base/Theme';

type inputProps = {
  inputStyle?: StyleProp<TextStyle>;
  onTextChange?: (text: string) => void;
  bgColor?: string;
  placeholder: string;
  value: string;
  type?: KeyboardType;
  password?: boolean;
} & TextInputProps;

export const MainTextInput = ({bgColor = CustomerTheme.colors['bg-gray'], inputStyle, onTextChange, placeholder, value, type, password, ...rest}: inputProps) => {
  return (
    <TextInput
      {...rest}
      value={value}
      secureTextEntry={password}
      removeClippedSubviews={false}
      keyboardType={type}
      placeholder={placeholder}
      onChangeText={onTextChange}
      style={[styles.input, inputStyle, {backgroundColor: bgColor}]}
    />
  );
};

export const MainTextInputWithClearButton = ({
  onClearPress,
  bgColor = CustomerTheme.colors['bg-gray'],
  inputStyle = {},
  onTextChange,
  password,
  type,
  ...props
}: inputProps & {onClearPress: () => void}) => {
  return (
    <View style={[{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 14, position: 'relative'}]}>
      <TextInput
        {...props}
        style={[{flex: 1}, styles.input, inputStyle, {backgroundColor: bgColor, marginBottom: 0}]}
        removeClippedSubviews={false}
        keyboardType={type}
        onChangeText={onTextChange}
        selectTextOnFocus
        secureTextEntry={password}
      />
      <View style={{position: 'absolute', width: 20, top: 0, bottom: 0, right: 10, justifyContent: "center", display: "flex"}}>
        <TouchableOpacity onPress={() => onClearPress()}>
          <FontAwesomeIcon color={CustomerTheme.colors['main-gray']} icon={faTimes} size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 20,
    marginBottom: 14,
    paddingVertical: 14,
    width: '100%',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: Platform.OS == "android" ? 'Type Atelier - Gordita' : 'Gordita',
    color: CustomerTheme.colors['main-gray'],
  },
});
