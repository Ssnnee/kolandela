import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, fmt } from './useThemeColors';

export function TransactionCard({
  description,
  amount,
  type,
  transactionDate,
}: {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  transactionDate: Date | string;
}) {
  const { textColor, mutedColor, primaryColor, violetColor, cardBg, borderColor, isDark } =
    useThemeColors();

  const isIncome = type === 'INCOME';
  const accentColor = isIncome ? primaryColor : violetColor;
  const accentDim = isIncome
    ? isDark ? 'rgba(255,121,102,0.12)' : 'rgba(255,100,80,0.1)'
    : isDark ? 'rgba(173,123,255,0.12)' : 'rgba(140,90,220,0.1)';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: cardBg, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor }}>
      <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: accentDim, marginRight: 12 }}>
        <Ionicons name={isIncome ? 'arrow-down-outline' : 'arrow-up-outline'} size={18} color={accentColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
          {description}
        </Text>
        <Text style={{ color: mutedColor, fontSize: 11, marginTop: 2 }}>
          {new Date(transactionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </Text>
      </View>
      <Text style={{ fontSize: 14, fontWeight: '700', color: accentColor }}>
        {isIncome ? '+' : '-'}{fmt(amount)}
      </Text>
    </View>
  );
}
