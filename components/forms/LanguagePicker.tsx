import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, rgba } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';
import type { LanguageCode } from '@/app/_i18n';

const LANGUAGES: { code: LanguageCode; labelKey: string; native: string }[] = [
  { code: 'en', labelKey: 'tabs.settings.english', native: 'English' },
  { code: 'fr', labelKey: 'tabs.settings.french', native: 'Français' },
];

interface LanguagePickerProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguagePicker({ visible, onClose }: LanguagePickerProps) {
  const { textColor, primaryColor, mutedColor, cardBg, borderColor } = useThemeColors();
  const { language, setLanguage, t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable onPress={() => { }} style={{ width: 280, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 8 }}>
          <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', textAlign: 'center', paddingVertical: 12 }}>
            {t('tabs.settings.selectLanguage')}
          </Text>
          {LANGUAGES.map((l) => {
            const isSelected = l.code === language;
            return (
              <TouchableOpacity
                key={l.code}
                onPress={() => { setLanguage(l.code); onClose(); }}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12,
                  backgroundColor: isSelected ? rgba(primaryColor, 0.1) : 'transparent',
                  gap: 12,
                }}
              >
                <View style={{
                  width: 34, height: 34, borderRadius: 9,
                  backgroundColor: isSelected ? rgba(primaryColor, 0.1) : rgba(textColor, 0.08),
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: isSelected ? primaryColor : textColor, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }}>{l.code}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: isSelected ? primaryColor : textColor, fontSize: 15, fontWeight: '500' }}>
                    {t(l.labelKey)}
                  </Text>
                  <Text style={{ color: mutedColor, fontSize: 12, marginTop: 1 }}>
                    {l.native}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
                )}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
