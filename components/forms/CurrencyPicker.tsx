import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, rgba, useCurrency } from '@/components/home/useThemeColors';
import { CURRENCIES } from '@/constants/currency';

interface CurrencyPickerProps {
  visible: boolean;
  onClose: () => void;
}

export function CurrencyPicker({ visible, onClose }: CurrencyPickerProps) {
  const { textColor, primaryColor, cardBg, borderColor } = useThemeColors();
  const { currency, setCurrency } = useCurrency();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable onPress={() => { }} style={{ width: 280, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 8 }}>
          <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', textAlign: 'center', paddingVertical: 12 }}>
            Select currencysne
          </Text>
          {CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c.code}
              onPress={() => { setCurrency(c); onClose(); }}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12,
                backgroundColor: c.code === currency.code ? rgba(primaryColor, 0.1) : 'transparent',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ color: textColor, fontSize: 18 }}>{c.symbol}</Text>
                <Text style={{ color: textColor, fontSize: 15, fontWeight: '500' }}>{c.code}</Text>
              </View>
              {c.code === currency.code && (
                <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
