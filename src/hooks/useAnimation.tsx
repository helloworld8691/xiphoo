import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';


export function useAnimation(scanning: boolean) {
  const value = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let res = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 0,
          useNativeDriver: false,
          duration: 800,
          easing: Easing.bezier(0.5, 0, 0.75, 0)
        }),
        Animated.timing(value, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
          easing: Easing.elastic(0.2)
        }),
      ])
    );
    res.start();
    return () => res.start();
  }, [scanning]);
  return value;
}
