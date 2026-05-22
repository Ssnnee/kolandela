import { View, Text, Switch } from 'react-native';
import { useThemeColors, rgba } from '@/components/home/useThemeColors';

interface FormToggleProps {
  label: string;
  sublabel?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export function FormToggle({ label, sublabel, value, onValueChange }: FormToggleProps) {
  const { textColor, mutedColor, primaryColor, cardBg, borderColor } = useThemeColors();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: cardBg, borderRadius: 12, borderWidth: 1, borderColor, padding: 14, marginBottom: 16 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: textColor, fontSize: 14, fontWeight: '500' }}>{label}</Text>
        {sublabel && (
          <Text style={{ color: mutedColor, fontSize: 12, marginTop: 2 }}>{sublabel}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: rgba(mutedColor, 0.25), true: primaryColor }}
        thumbColor="white"
      />
    </View>
  );
}
