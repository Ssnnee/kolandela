import { View, Text } from 'react-native';
import { useThemeColors, useCurrency, rgba } from './useThemeColors';

export function SpendProgress({
  income,
  expenses,
  planned,
}: {
  income: number;
  expenses: number;
  planned: number;
}) {
  const { textColor, mutedColor, violetColor, cardBg, borderColor, isDark } = useThemeColors();
  const { format } = useCurrency();

  const spentRatio = income > 0 ? Math.min(expenses / income, 1) : 0;
  const plannedRatio = income > 0 ? Math.min((expenses + planned) / income, 1) : 0;
  const spentPct = Math.round(spentRatio * 100);

  const barColor =
    spentPct < 70
      ? isDark ? 'rgb(0, 250, 217)' : 'rgb(0, 200, 175)'
      : spentPct < 90
        ? isDark ? 'rgb(255, 121, 102)' : 'rgb(255, 100, 80)'
        : 'rgb(255, 59, 48)';

  return (
    <View style={{ marginHorizontal: 24, marginBottom: 20, backgroundColor: cardBg, borderRadius: 18, padding: 18, borderWidth: 1, borderColor }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <View>
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>
            Spent this month
          </Text>
          <Text style={{ color: textColor, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }}>
            {format(expenses)}
          </Text>
        </View>
        <View style={{ backgroundColor: rgba(barColor, 0.13), borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, marginTop: 2 }}>
          <Text style={{ color: barColor, fontSize: 13, fontWeight: '700' }}>{spentPct}%</Text>
        </View>
      </View>

      {/* Progress track */}
      <View style={{ height: 8, backgroundColor: isDark ? 'rgb(46, 46, 58)' : 'rgb(220, 220, 232)', borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
        {plannedRatio > spentRatio && (
          <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${plannedRatio * 100}%`, backgroundColor: rgba(violetColor, 0.25), borderRadius: 100 }} />
        )}
        <View style={{ height: '100%', width: `${spentRatio * 100}%`, backgroundColor: barColor, borderRadius: 100 }} />
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: barColor }} />
            <Text style={{ color: mutedColor, fontSize: 11 }}>Spent</Text>
          </View>
          {planned > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: rgba(violetColor, 0.5) }} />
              <Text style={{ color: mutedColor, fontSize: 11 }}>+Planned</Text>
            </View>
          )}
        </View>
        <Text style={{ color: mutedColor, fontSize: 11 }}>of {format(income)}</Text>
      </View>
    </View>
  );
}
