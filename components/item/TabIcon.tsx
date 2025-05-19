import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

interface TabIconProps {
  focused: boolean;
  iconName: string;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, iconName, color, size }) => {
  const viewRef = useRef<any>(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({
        0: { scale: 0.5, rotate: '0deg' },
        1: { scale: 1.5, rotate: '360deg' },
      });
    } else {
      viewRef.current.animate({
        0: { scale: 1.5, rotate: '360deg' },
        1: { scale: 1, rotate: '0deg' },
      });
    }
  }, [focused]);

  return (
    <Animatable.View ref={viewRef} duration={500} style={styles.iconContainer}>
      <Ionicons name={iconName} size={size} color={color} />
    </Animatable.View>
  );
};

export default TabIcon;

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});