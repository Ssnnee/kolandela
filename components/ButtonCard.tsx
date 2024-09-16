import { Link } from 'expo-router';
import { forwardRef } from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export enum LinkType {
  expenses = 'expenses',
  income = 'income',
  plan = 'plan',
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  href: LinkType;
}

export const ButtonCard = ( { title, onPress, href }: ButtonProps) => {
  return (
      <TouchableOpacity className='w-full' >
        <Link href={`/create/${href}` } onPress={onPress} className={ `${styles.button}` }>
        <View className='flex-row gap-5 justify-center items-center'>
        <Text className={styles.buttonText}>{title}</Text>
        <View className='h-8 w-8 items-center justify-center rounded-full text-white  bg-transparent border-2 border-foreground '>
          <Text className='text-foreground font-bold'>+</Text>
        </View>
        </View>
        </Link>
      </TouchableOpacity>
  );
};

const styles = {
  button: 'w-full flex-row  justify-center gap-5 p-5 border-dashed  rounded-xl border-foreground border-2',
  buttonText: 'text-white text-lg font-semibold text-center',
};
