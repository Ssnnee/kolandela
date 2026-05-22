import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useThemeColors } from '@/components/home/useThemeColors';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function FormInput({ label, error, ...props }: FormInputProps) {
  const { textColor, mutedColor, cardBg, borderColor, isDark } = useThemeColors();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </Text>
      <TextInput
        {...props}
        placeholderTextColor={mutedColor}
        style={[{
          backgroundColor: cardBg,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: error ? 'rgb(255,59,48)' : borderColor,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: textColor,
          fontSize: 15,
        }, props.style]}
      />
      {error && (
        <Text style={{ color: 'rgb(255,59,48)', fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
}
