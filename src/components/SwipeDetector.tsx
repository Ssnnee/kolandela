import React from 'react';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface SwipeDetectorProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeDetector({ children, onSwipeLeft, onSwipeRight }: SwipeDetectorProps) {
  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onStart(() => {
      if (onSwipeLeft) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onSwipeLeft();
      }
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onStart(() => {
      if (onSwipeRight) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onSwipeRight();
      }
    });

  const gestures = Gesture.Exclusive(flingLeft, flingRight);

  return (
    <GestureDetector gesture={gestures}>
      {children}
    </GestureDetector>
  );
}
