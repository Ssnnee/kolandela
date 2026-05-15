import { View, Text } from 'react-native';
import { useThemeColors, fmt } from './useThemeColors';

export function SummaryCards({
  income,
  expenses,
  remaining,
  savingsRate,
}: {
  income: number;
  expenses: number;
  remaining: number;
  savingsRate: number;
}) {
  const { primaryColor, violetColor, cardBg, borderColor, textColor, mutedColor } =
    useThemeColors();

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 20, gap: 12 }}>
      {/* Remaining hero */}
      <View style={{ backgroundColor: primaryColor, borderRadius: 20, padding: 20 }}>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
          Remaining
        </Text>
        <Text style={{ color: 'white', fontSize: 32, fontWeight: '800', letterSpacing: -1 }}>
          {fmt(remaining)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>{savingsRate}% saved</Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>of income</Text>
        </View>
      </View>

      {/* Income + Expenses row */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {[
          { label: 'Income', value: income, color: primaryColor },
          { label: 'Expenses', value: expenses, color: violetColor },
        ].map((item) => (
          <View key={item.label} style={{ flex: 1, backgroundColor: cardBg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
              <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {item.label}
              </Text>
            </View>
            <Text style={{ color: textColor, fontSize: 18, fontWeight: '700', letterSpacing: -0.5 }}>
              {fmt(item.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
