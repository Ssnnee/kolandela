import { forwardRef } from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const ButtonCard = forwardRef<TouchableOpacity, ButtonProps>(({ title, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity ref={ref} {...touchableProps} className={`${styles.button} ${touchableProps.className}`}>
      <Text className={styles.buttonText}>{title}</Text>
      <View className='h-8 w-8 items-center justify-center rounded-full text-white  bg-transparent border-2 border-foreground '>
        <Text className='text-foreground font-bold'>+</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = {
  button: 'w-full flex-row items-center  justify-center gap-5 p-5 border-dashed  rounded-xl border-foreground border-2',
  buttonText: 'text-white text-lg font-semibold text-center',
};
