import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, rgba, useCurrency } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';
import { CURRENCIES } from '@/constants/currency';

interface CurrencyPickerProps {
  visible: boolean;
  onClose: () => void;
}

export function CurrencyPicker({ visible, onClose }: CurrencyPickerProps) {
  const { textColor, primaryColor, mutedColor, cardBg, borderColor } = useThemeColors();
  const { currency, setCurrency } = useCurrency();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable onPress={() => { }} style={{ width: 280, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 8 }}>
          <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', textAlign: 'center', paddingVertical: 12 }}>
            {t('tabs.settings.selectCurrency')}
          </Text>
          {CURRENCIES.map((c) => {
            const isSelected = c.code === currency.code;
            return (
              <TouchableOpacity
                key={c.code}
                onPress={() => { setCurrency(c); onClose(); }}
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
                  <Text style={{ color: isSelected ? primaryColor : textColor, fontSize: 15, fontWeight: '700' }}>
                    {c.symbol}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: isSelected ? primaryColor : textColor, fontSize: 15, fontWeight: '500' }}>
                    {c.code}
                  </Text>
                  <Text style={{ color: mutedColor, fontSize: 12, marginTop: 1 }}>
                    {c.symbol} — {c.locale}
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
