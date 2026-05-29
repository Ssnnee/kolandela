import { Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, rgba } from '@/components/home/useThemeColors';
import { useTheme } from '@/app/_context/ThemeContext';

const THEMES = [
  { key: 'system' as const, label: 'System', icon: 'settings-outline' as const },
  { key: 'light' as const, label: 'Light', icon: 'sunny' as const },
  { key: 'dark' as const, label: 'Dark', icon: 'moon' as const },
];

interface ThemePickerProps {
  visible: boolean;
  onClose: () => void;
}

export function ThemePicker({ visible, onClose }: ThemePickerProps) {
  const { textColor, primaryColor, cardBg, borderColor } = useThemeColors();
  const { theme, setTheme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable onPress={() => {}} style={{ width: 260, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 8 }}>
          <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', textAlign: 'center', paddingVertical: 12 }}>
            Select theme
          </Text>
          {THEMES.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => { setTheme(t.key); onClose(); }}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
                backgroundColor: t.key === theme ? rgba(primaryColor, 0.1) : 'transparent',
              }}
            >
              <Ionicons name={t.icon} size={20} color={t.key === theme ? primaryColor : textColor} />
              <Text style={{
                flex: 1, color: t.key === theme ? primaryColor : textColor,
                fontSize: 15, fontWeight: '500',
              }}>
                {t.label}
              </Text>
              {t.key === theme && (
                <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
