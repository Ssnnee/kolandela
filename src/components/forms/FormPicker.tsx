import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeColors } from '@/components/home/useThemeColors';

interface Option<T> {
  label: string;
  value: T;
}

interface FormPickerProps<T> {
  label: string;
  options: Option<T>[];
  selected: T;
  onSelect: (v: T) => void;
  error?: string;
}

export function FormPicker<T extends string>({ label, options, selected, onSelect, error }: FormPickerProps<T>) {
  const { textColor, mutedColor, primaryColor, cardBg, borderColor } = useThemeColors();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {options.map((opt) => {
          const isSelected = opt.value === selected;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: isSelected ? primaryColor : cardBg,
                borderWidth: 1,
                borderColor: isSelected ? primaryColor : borderColor,
              }}>
              <Text style={{ color: isSelected ? 'white' : textColor, fontSize: 14, fontWeight: isSelected ? '600' : '400' }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {error && (
        <Text style={{ color: 'rgb(255,59,48)', fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
}
