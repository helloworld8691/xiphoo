import {StyleSheet} from 'react-native';
import {CustomerTheme} from './Theme';

export const mainStyles = StyleSheet.create({
  shadowM: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
  },
  mainTitle: {
    fontSize: 22,
    color: CustomerTheme.colors['main-gray'],
    marginTop: 14,
    textAlign: "center"
  },
  mainText: {
    fontSize: 15,
    color: CustomerTheme.colors['main-gray'],
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 315,
  },
});
