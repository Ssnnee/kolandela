import { useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useThemeColors } from './useThemeColors';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface MonthOption {
  monthIndex: number;
  year: number;
  label: string;
}

const CHIP_WIDTH = 95;
const CHIP_GAP = 8;
const PADDING = 24;

export function buildMonthOptions(): MonthOption[] {
  const now = new Date();
  const options: MonthOption[] = [];
  for (let i = 11; i >= -12; i--) {
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
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const now = new Date();
    const idx = options.findIndex(
      (o) => o.monthIndex === now.getMonth() && o.year === now.getFullYear()
    );
    if (idx >= 0) {
      const screenWidth = Dimensions.get('window').width;
      const offset = idx * (CHIP_WIDTH + CHIP_GAP) + PADDING - (screenWidth - CHIP_WIDTH) / 2;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Math.max(0, offset), animated: false });
      }, 50);
    }
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: PADDING, gap: CHIP_GAP }}
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
