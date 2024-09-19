import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SelectProps = {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

export default function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <View className="mb-4">
      <Text className="text-white mb-2">{label}</Text>
      <View className="flex-row flex-wrap">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`mr-2 mb-2 px-3 py-2 rounded-full flex-row items-center
              ${value === option.value ? 'bg-green' : 'bg-background-variant'}`}
          >
            <Text className={`mr-2 ${value === option.value ? 'text-dark' : 'text-white'}`}>
              {option.label}
            </Text>
            {value === option.value && (
              <Ionicons name="checkmark" size={16} color="#0E0E12" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
