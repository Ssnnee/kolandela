import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { useThemeColors } from './useThemeColors';

export function FilterChips<T extends string | null>({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: T }[];
  selected: T;
  onSelect: (v: T) => void;
}) {
  const { primaryColor, cardBg, borderColor, mutedColor } = useThemeColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {options.map((opt) => {
        const isSelected = opt.value === selected;
        return (
          <TouchableOpacity
            key={String(opt.value)}
            onPress={() => onSelect(opt.value)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 100,
              backgroundColor: isSelected ? primaryColor : cardBg,
              borderWidth: 1,
              borderColor: isSelected ? primaryColor : borderColor,
            }}>
            <Text style={{ fontSize: 12, fontWeight: isSelected ? '600' : '400', color: isSelected ? 'white' : mutedColor }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
