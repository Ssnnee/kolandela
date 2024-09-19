import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { capitalizeFirstLetters } from '~/lib/utils';
import { useNavigation } from '@react-navigation/native';

type ExpenseCardProps = {
  id: string;
  description: string;
  date: Date;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
};

export default function  ExpenseCard ({ id, description, date, amount, type }: ExpenseCardProps) {
  const navigation = useNavigation();

  const handlePress = () => {
    // navigation.navigate('ExpenseInfo', { id });
    console.log('Pressed');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className='w-full flex-row items-center justify-between p-5 rounded-3xl border-foreground border-2 mb-4'>
        <View>
          <Text className='text-white font-bold'>{description}</Text>
          <Text className='text-violate'>
            {capitalizeFirstLetters(format(date, 'EEE, dd MMM yyyy, HH:mm', { locale: fr })).replace(/\./g, '')}
          </Text>
        </View>
        <View className='flex-row gap-4 items-center'>
          <Text className={type === 'INCOME' ? 'text-green text-3xl font-bold' : 'text-red text-3xl font-bold'}>
            {type === 'INCOME' ? '+' : '-'}
          </Text>
          <Text className='text-white font-bold'>{amount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

