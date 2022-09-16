import React from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, BackHandler } from 'react-native'

export function ScreenWithCustomBackBehavior({ onBackPress, canBeExecuted, children}: {onBackPress: () => void, canBeExecuted?: ()=> boolean, children: React.ReactChildren | React.ReactNode}) {

  useFocusEffect(
    React.useCallback(() => {
      const handler = () => {
        if (!canBeExecuted||canBeExecuted()) {
          onBackPress();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', handler);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', handler);
    }, [onBackPress, canBeExecuted])
  );

  return (
    <>
    {children}
    </>
  )
}
