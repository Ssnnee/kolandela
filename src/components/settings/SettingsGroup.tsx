import { View } from 'react-native';
import { useThemeColors } from '@/components/home/useThemeColors';

export function SettingsGroup({ children }: { children: React.ReactNode }) {
  const { cardBg, borderColor } = useThemeColors();
  return (
    <View style={{ marginHorizontal: 16, backgroundColor: cardBg, borderRadius: 18, borderWidth: 1, borderColor, overflow: 'hidden' }}>
      {children}
    </View>
  );
}
