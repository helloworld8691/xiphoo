import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import {CustomerTheme} from '../base/Theme';
import {MainButton} from './MainButton';
import {RootText} from './RootText';

type scanPopupProps = {
  visible: boolean;
  onClosePress: () => void;
  onButtonPress?: () => void;
  description: string;
  title: string;
  type: 'error' | 'success';
  timer?: number;
  forcePopup?: boolean;
  buttonText?: string;
  noBackdrop?: boolean;
  actions?: {
    onButtonPress: () => void;
    buttonText: string;
    bg?: string;
  }[];
};

export const InformationPopup = ({visible, onClosePress, onButtonPress, type, description, title, timer, forcePopup, buttonText, actions, noBackdrop}: scanPopupProps) => {
  let color;
  if (type == 'error') {
    color = CustomerTheme.colors['error-red'];
  } else if (type == 'success') {
    color = CustomerTheme.colors['main-green'];
  }

  useEffect(() => {
    if (visible && timer) {
      var cb = setTimeout(() => onClosePress(), timer);
    }
    return () => {
      cb && clearTimeout(cb);
    };
  }, [visible]);

  return (
    <Modal
      style={[{justifyContent: 'flex-end', alignItems: 'stretch', margin: 16}]}
      hasBackdrop={timer || noBackdrop ? false : true}
      useNativeDriver={true}
      isVisible={visible}
      onBackButtonPress={forcePopup ? () => {} : onClosePress}
      coverScreen={timer || noBackdrop ? false : true}
      animationOutTiming={750}
      onBackdropPress={forcePopup ? () => {} : onClosePress}>
      <View style={{...styles.modal}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <FontAwesomeIcon color={color} icon={type == 'error' ? faTimes : faCheck} size={18} />
          <RootText fontWeight={700} style={{color: color, marginLeft: 6, flex: 1}}>
            {title}
          </RootText>
          {!forcePopup && noBackdrop && (
            <TouchableOpacity onPress={onClosePress} hitSlop={{bottom: 40, left: 40, top: 40, right: 40}}>
              <FontAwesomeIcon color={CustomerTheme.colors['main-gray']} icon={faTimes} size={18} />
            </TouchableOpacity>
          )}
        </View>
        <RootText>{description}</RootText>
        {onButtonPress && (
          <MainButton buttonStyle={{marginTop: 16}} onPress={onButtonPress}>
            <RootText style={{color: 'white'}}>{buttonText}</RootText>
          </MainButton>
        )}
        {actions?.map((a) => (
          <MainButton buttonStyle={{marginTop: 16}} onPress={a.onButtonPress} bgColor={a.bg}>
            <RootText style={{color: 'white'}}>{a.buttonText}</RootText>
          </MainButton>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: 'flex-start',
    height: 'auto',
    backgroundColor: 'white',
    maxHeight: '100%',
    padding: 16,
    borderRadius: 10,
    elevation: 10,
  },
});
