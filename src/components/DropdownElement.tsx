import {faCheckCircle, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {CustomerTheme} from '../base/Theme';
import {RootText} from './RootText';

type dropdownElement = {
  text: string;
  selected?: boolean;
  icon?: string;
};

export const DropdownElement = ({text, selected, icon}: dropdownElement) => {
  //console.log(icon)
  return (
    <View style={styles.container}>
      {icon && <View style={{ width: 24, height: 24, aspectRatio: 1 }} ><SvgUri width="100%" height="100%" uri={icon} preserveAspectRatio="true"/></View>}
      {!icon && (
        <FontAwesomeIcon
          style={{marginRight: 12}}
          size={24}
          color={selected ? CustomerTheme.colors['main-green'] : CustomerTheme.colors["error-red"]}
          icon={selected ? faCheckCircle : faTimesCircle}
        />
      )}
      <RootText style={[styles.text, {color: selected ? CustomerTheme.colors['main-green'] : CustomerTheme.colors["error-red"]}]}>{text}</RootText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#fff',
  },
  text: {
    color: '#858585',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
