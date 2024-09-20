import React, { useCallback } from 'react';
import { Pressable, Text, PressableProps, Animated } from 'react-native';
import { Link, Href } from 'expo-router';

interface ButtonProps extends PressableProps {
  onPress?: () => void;
  title: string;
  href?: Href<string>;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  href,
  backgroundColor = '#FF7966', // Default to orange
  textColor = '#ffffff', // Default to white
  className = '',
  ...props
}) => {
  const animatedOpacity = new Animated.Value(1);

  const handlePressIn = useCallback(() => {
    Animated.timing(animatedOpacity, {
      toValue: 0.7,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressOut = useCallback(() => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  const ButtonContent = (
    <Animated.View style={{ opacity: animatedOpacity }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`h-14 mb-2 flex justify-center items-center rounded-full ${className}`}
        style={{ backgroundColor }}
        {...props}
      >
        <Text style={{ color: textColor }}>{title}</Text>
      </Pressable>
    </Animated.View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        {ButtonContent}
      </Link>
    );
  }

  return ButtonContent;
};

export default Button;
