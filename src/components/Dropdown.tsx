import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState} from 'react';
import {LayoutAnimation, Platform, StyleSheet, TouchableOpacity, UIManager, View} from 'react-native';
import {CustomerTheme} from '../base/Theme';
import {RootText} from './RootText';

type dropdownProps = {
  selected: boolean;
  title: string;
  onSelectedPress: () => void;
  children?: React.ReactNode;
  initialState?: boolean;
};

export const Dropdown = ({title, children, initialState = false}: dropdownProps) => {
  const [dropdown, setDropdown] = useState(initialState);

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  return (
    <View style={{paddingTop: 16, backgroundColor: 'white'}}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setDropdown(!dropdown);
        }}
        style={{...styles.container, backgroundColor: dropdown ? CustomerTheme.colors['main-gray'] : CustomerTheme.colors['bg-gray']}}>
        <FontAwesomeIcon color={dropdown ? 'white' : CustomerTheme.colors['main-gray']} size={18} icon={dropdown?faChevronUp:faChevronDown} />
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <RootText fontWeight={700} style={{...styles.title, color: dropdown ? 'white' : CustomerTheme.colors['main-gray']}}>
            {title}
          </RootText>
        </View>
      </TouchableOpacity>
      {dropdown ? <View style={styles.dropdown}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: 10,
    paddingLeft: 14,
  },
  title: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  dropdown: {
    paddingTop: 10,
    paddingHorizontal: 4,
  },
});
