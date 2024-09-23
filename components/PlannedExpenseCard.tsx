import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { capitalizeFirstLetters } from '~/lib/utils';
import Checkbox from './CheckBox';
import { Link } from 'expo-router';

type PlannedExpenseCardProps = {
  id: string;
  description: string;
  date: Date;
  amount: number;
  isExecuted: boolean;
  onCheckboxChange: (id: string, value: boolean) => void;
};

const PlannedExpenseCard: React.FC<PlannedExpenseCardProps> = ({
  id, description, date, amount, isExecuted, onCheckboxChange
}) => {

  const handlePress = () => {
    console.log('Pressed');
  };

  return (
    <Link
      href={{
        pathname: "/pannedtransactions/[id]",
        params: { id }
      }}
      asChild
    >
      <TouchableOpacity onPress={handlePress}>
        <View className='w-full flex-row items-center justify-between p-5 rounded-3xl border-foreground border-2 mb-2'>
          <View>
            <Text className='text-white font-bold'>{description}</Text>
            <Text className='text-violate'>
              {capitalizeFirstLetters(format(date, 'EEE, dd MMM yyyy', { locale: fr })).replace(/\./g, '')}
            </Text>
          </View>
          <View className='flex-row gap-4 items-center'>
            <Text className='text-white font-bold'>{amount}</Text>
            <Checkbox
              checked={isExecuted}
              onChange={(value) => onCheckboxChange(id, value)}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default PlannedExpenseCard;
