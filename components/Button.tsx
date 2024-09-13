import { ReactNode, forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = {
  children?: ReactNode;
} & TouchableOpacityProps;

export const Button = forwardRef<TouchableOpacity, ButtonProps>(({ children, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity ref={ref} {...touchableProps} className={`${touchableProps.className}`}>
      {children}
    </TouchableOpacity>
  );
});

