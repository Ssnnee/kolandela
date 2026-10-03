import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/components/home/useThemeColors';

export function SettingsRow({
  icon,
  iconColor,
  label,
  sublabel,
  onPress,
  right,
  danger = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  const { textColor, mutedColor, isDark } = useThemeColors();
  const resolvedIconColor = iconColor ?? (isDark ? 'rgb(162,162,181)' : 'rgb(100,100,125)');

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.65 : 1}
      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 }}>
      <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: resolvedIconColor + '18', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={icon} size={17} color={danger ? 'rgb(255,59,48)' : resolvedIconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: danger ? 'rgb(255,59,48)' : textColor, fontSize: 14, fontWeight: '500' }}>
          {label}
        </Text>
        {sublabel && (
          <Text style={{ color: mutedColor, fontSize: 12, marginTop: 1 }}>{sublabel}</Text>
        )}
      </View>
      {right ?? (onPress && <Ionicons name="chevron-forward" size={15} color={mutedColor} />)}
    </TouchableOpacity>
  );
}

export function SettingsDivider() {
  const { borderColor } = useThemeColors();
  return <View style={{ height: 1, backgroundColor: borderColor, marginLeft: 64 }} />;
}
