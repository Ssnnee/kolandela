import React from "react";
import { format } from "date-fns";
import { Text, TouchableOpacity, View } from "react-native";

type YearCardProps = {
  date: Date;
  total: number;
};

export default function YearCard({ date, total }: YearCardProps) {
  const year = format(new Date(date), 'yyyy');
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(total));

  const isPositive = total >= 0;

  return (
    <TouchableOpacity className="bg-[#26262F] rounded-3xl p-4 items-center w-[150px] mb-4">
      <Text className="text-white text-lg font-bold mb-2">{year}</Text>
      <View className="mb-1">
        <Text className={`text-base font-bold ${isPositive ? 'text-[#00FAD9]' : 'text-[#FF7966]'}`}>
          {isPositive ? '+' : '-'}{formattedTotal}
        </Text>
      </View>
      <Text className="text-[#A2A2B5] text-xs">
        {isPositive ? 'Net Savings' : 'Net Expense'}
      </Text>
    </TouchableOpacity>
  );
}

