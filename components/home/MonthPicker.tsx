import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { useThemeColors } from './useThemeColors';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface MonthOption {
  monthIndex: number;
  year: number;
  label: string;
}

export function buildMonthOptions(): MonthOption[] {
  const now = new Date();
  const options: MonthOption[] = [];
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    options.push({
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
      label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
    });
  }
  return options;
}

export function MonthPicker({
  options,
  selectedMonth,
  selectedYear,
  onSelect,
}: {
  options: MonthOption[];
  selectedMonth: number;
  selectedYear: number;
  onSelect: (date: Date) => void;
}) {
  const { primaryColor, cardBg, borderColor, mutedColor } = useThemeColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
      style={{ marginBottom: 20 }}>
      {options.map((option) => {
        const isSelected = option.monthIndex === selectedMonth && option.year === selectedYear;
        return (
          <TouchableOpacity
            key={option.label}
            onPress={() => onSelect(new Date(option.year, option.monthIndex, 1))}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderRadius: 100,
              backgroundColor: isSelected ? primaryColor : cardBg,
              borderWidth: 1,
              borderColor: isSelected ? primaryColor : borderColor,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: isSelected ? '600' : '400',
                color: isSelected ? 'white' : mutedColor,
              }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
