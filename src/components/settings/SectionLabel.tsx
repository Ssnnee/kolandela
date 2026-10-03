import { Text } from 'react-native';
import { useThemeColors } from '@/components/home/useThemeColors';

export function SectionLabel({ label }: { label: string }) {
  const { mutedColor } = useThemeColors();
  return (
    <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 24, marginBottom: 8, marginTop: 24 }}>
      {label}
    </Text>
  );
}
