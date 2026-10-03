import { Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, rgba } from '@/components/home/useThemeColors';
import { useTheme } from '@/app/_context/ThemeContext';
import { useTranslation } from '@/app/_context/LanguageContext';

const THEMES = [
  { key: 'system' as const, tKey: 'global.theme.system', icon: 'settings-outline' as const },
  { key: 'light' as const, tKey: 'global.theme.light', icon: 'sunny' as const },
  { key: 'dark' as const, tKey: 'global.theme.dark', icon: 'moon' as const },
];

interface ThemePickerProps {
  visible: boolean;
  onClose: () => void;
}

export function ThemePicker({ visible, onClose }: ThemePickerProps) {
  const { textColor, primaryColor, cardBg, borderColor } = useThemeColors();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable onPress={() => {}} style={{ width: 260, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 8 }}>
          <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', textAlign: 'center', paddingVertical: 12 }}>
            {t('tabs.settings.selectTheme')}
          </Text>
          {THEMES.map((tItem) => (
            <TouchableOpacity
              key={tItem.key}
              onPress={() => { setTheme(tItem.key); onClose(); }}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
                backgroundColor: tItem.key === theme ? rgba(primaryColor, 0.1) : 'transparent',
              }}
            >
              <Ionicons name={tItem.icon} size={20} color={tItem.key === theme ? primaryColor : textColor} />
              <Text style={{
                flex: 1, color: tItem.key === theme ? primaryColor : textColor,
                fontSize: 15, fontWeight: '500',
              }}>
                {t(tItem.tKey)}
              </Text>
              {tItem.key === theme && (
                <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
