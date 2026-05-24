import { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/components/home/useThemeColors';
import { DatePickerModal } from './DatePickerModal';

interface DatePickerButtonProps {
  label: string;
  date: Date;
  onChange: (date: Date) => void;
  error?: string;
}

export function DatePickerButton({ label, date, onChange, error }: DatePickerButtonProps) {
  const { textColor, mutedColor, cardBg, borderColor } = useThemeColors();
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </Text>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: cardBg, borderRadius: 12, borderWidth: 1, borderColor: error ? 'rgb(255,59,48)' : borderColor, paddingHorizontal: 14, paddingVertical: 12, gap: 10 }}>
        <Ionicons name="calendar-outline" size={18} color={mutedColor} />
        <Text style={{ flex: 1, color: textColor, fontSize: 15 }}>
          {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
        <Ionicons name="chevron-down" size={16} color={mutedColor} />
      </TouchableOpacity>
      {error && (
        <Text style={{ color: 'rgb(255,59,48)', fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}

      <DatePickerModal
        visible={visible}
        date={date}
        onSelect={onChange}
        allowFuture={false}
        onClose={() => setVisible(false)}
      />
    </View>
  );
}
