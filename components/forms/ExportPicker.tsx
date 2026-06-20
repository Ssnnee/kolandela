import { Text, TouchableOpacity, Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, rgba } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';

interface ExportPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (format: 'JSON' | 'CSV') => void;
}

export function ExportPicker({ visible, onClose, onSelect }: ExportPickerProps) {
  const { textColor, cardBg, borderColor, isDark } = useThemeColors();
  const { t } = useTranslation();

  const OPTIONS = [
    {
      key: 'JSON' as const,
      label: t('global.dialogs.exportAsJSON'),
      icon: 'copy-outline' as const,
      color: isDark ? 'rgb(0,250,217)' : 'rgb(0,200,175)',
    },
    {
      key: 'CSV' as const,
      label: t('global.dialogs.exportAsCSV'),
      icon: 'document-text-outline' as const,
      color: isDark ? 'rgb(173,123,255)' : 'rgb(140,90,220)',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable
          onPress={() => {}}
          style={{ width: 280, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 8 }}
        >
          <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', textAlign: 'center', paddingTop: 16, paddingBottom: 8 }}>
            {t('global.dialogs.exportTitle')}
          </Text>
          <Text style={{ color: 'rgb(131,131,156)', fontSize: 13, textAlign: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
            {t('global.dialogs.exportDesc')}
          </Text>
          {OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={() => {
                onSelect(item.key);
                onClose();
              }}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 12,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: rgba(item.color, 0.1),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={{ flex: 1, color: textColor, fontSize: 15, fontWeight: '500' }}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="rgb(131,131,156)" />
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
