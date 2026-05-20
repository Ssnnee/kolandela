import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { transactions, categories } from '@/db/schema';
import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { useThemeColors, fmt, rgba } from '@/components/home/useThemeColors';
import { useScrollHandler } from '@/lib/useScrollHandler';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 88;

type ChartTab = 'bar' | 'line';

// ── Delta badge ───────────────────────────────────────────────────────────────
function DeltaBadge({ change, isPositiveGood = true }: { change: number; isPositiveGood?: boolean }) {
  const { mutedColor, isDark } = useThemeColors();
  if (change === 0) return <Text style={{ color: mutedColor, fontSize: 12 }}>—</Text>;
  const isPositive = change > 0;
  const good = isPositive === isPositiveGood;
  const color = good
    ? isDark ? 'rgb(0,250,217)' : 'rgb(0,200,175)'
    : 'rgb(255,59,48)';
  const bg = good
    ? isDark ? 'rgba(0,250,217,0.12)' : 'rgba(0,200,175,0.1)'
    : 'rgba(255,59,48,0.12)';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: bg, borderRadius: 100, paddingHorizontal: 7, paddingVertical: 3 }}>
      <Ionicons name={isPositive ? 'arrow-up' : 'arrow-down'} size={10} color={color} />
      <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{Math.abs(change)}%</Text>
    </View>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const scrollHandler = useScrollHandler();
  const { textColor, mutedColor, primaryColor, violetColor, cardBg, borderColor, tabBg, isDark } =
    useThemeColors();

  const { data: trans } = useLiveQuery(db.select().from(transactions));
  const { data: cats } = useLiveQuery(db.select().from(categories));

  const [chartTab, setChartTab] = useState<ChartTab>('line');

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const greenColor = isDark ? 'rgb(0,250,217)' : 'rgb(0,200,175)';
  const redColor = 'rgb(255,59,48)';

  const allTrans = useMemo(() => (trans ?? []).filter((t) => !t.isDeleted), [trans]);

  // ── All-time totals ──
  const allTimeIncome = useMemo(
    () => allTrans.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
    [allTrans]
  );
  const allTimeExpenses = useMemo(
    () => allTrans.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    [allTrans]
  );
  const allTimeNet = allTimeIncome - allTimeExpenses;
  const savingsRate = allTimeIncome > 0 ? Math.round((allTimeNet / allTimeIncome) * 100) : 0;

  // ── Current & previous month ──
  const currentMonthTrans = useMemo(
    () => allTrans.filter((t) => {
      const d = new Date(t.transactionDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }),
    [allTrans]
  );
  const prevMonthTrans = useMemo(
    () => allTrans.filter((t) => {
      const d = new Date(t.transactionDate);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    }),
    [allTrans]
  );

  const currentIncome = currentMonthTrans.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const currentExpenses = currentMonthTrans.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const currentNet = currentIncome - currentExpenses;
  const prevIncome = prevMonthTrans.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const prevExpenses = prevMonthTrans.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const prevNet = prevIncome - prevExpenses;

  const incomeChange = prevIncome > 0 ? Math.round(((currentIncome - prevIncome) / prevIncome) * 100) : 0;
  const expenseChange = prevExpenses > 0 ? Math.round(((currentExpenses - prevExpenses) / prevExpenses) * 100) : 0;
  const netChange = prevNet !== 0 ? Math.round(((currentNet - prevNet) / Math.abs(prevNet)) * 100) : 0;

  // ── Quick stats ──
  const avgExpense = useMemo(() => {
    const exp = allTrans.filter((t) => t.type === 'EXPENSE');
    return exp.length > 0 ? Math.round(exp.reduce((s, t) => s + t.amount, 0) / exp.length) : 0;
  }, [allTrans]);

  const biggestExpense = useMemo(
    () => allTrans.filter((t) => t.type === 'EXPENSE').reduce((max, t) => t.amount > max ? t.amount : max, 0),
    [allTrans]
  );

  // Most active day of week
  const mostActiveDay = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = Array(7).fill(0);
    allTrans.forEach((t) => counts[new Date(t.transactionDate).getDay()]++);
    const max = Math.max(...counts);
    return max > 0 ? days[counts.indexOf(max)] : '—';
  }, [allTrans]);

  // ── Top expense categories (all-time) ──
  const topCategories = useMemo(() => {
    const catMap = new Map<string, { name: string; color: string; icon: string | null; total: number }>();
    (cats ?? []).filter((c) => !c.isDeleted && c.type === 'EXPENSE').forEach((c) => {
      catMap.set(c.id, { name: c.name, color: c.color, icon: c.icon, total: 0 });
    });
    allTrans.filter((t) => t.type === 'EXPENSE').forEach((t) => {
      const entry = catMap.get(t.categoryId);
      if (entry) entry.total += t.amount;
    });
    return [...catMap.values()]
      .filter((c) => c.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [allTrans, cats]);

  const topCatTotal = topCategories.reduce((s, c) => s + c.total, 0);

  // ── 12-month line data ──
  const monthlyData = useMemo(() => {
    const data: { month: string; income: number; expenses: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const m = date.getMonth();
      const y = date.getFullYear();
      const mt = allTrans.filter((t) => {
        const d = new Date(t.transactionDate);
        return d.getMonth() === m && d.getFullYear() === y;
      });
      data.push({
        month: MONTHS[m].slice(0, 1), // single letter for space
        income: mt.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
        expenses: mt.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
      });
    }
    return data;
  }, [allTrans, currentMonth, currentYear]);

  // ── Weekly bar data (current month) — label on FIRST bar of each pair ──
  const barData = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const result: any[] = [];
    for (let w = 0; w < 4; w++) {
      const startDay = w * 7 + 1;
      const endDay = Math.min((w + 1) * 7, daysInMonth);
      const wt = currentMonthTrans.filter((t) => {
        const d = new Date(t.transactionDate).getDate();
        return d >= startDay && d <= endDay;
      });
      const income = wt.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
      const expenses = wt.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
      // Income bar carries the label
      result.push({ value: income, frontColor: primaryColor, label: `W${w + 1}`, spacing: 4, labelTextStyle: { color: mutedColor, fontSize: 10 } });
      result.push({ value: expenses, frontColor: violetColor, spacing: 16 });
    }
    return result;
  }, [currentMonthTrans, currentMonth, currentYear, primaryColor, violetColor, mutedColor]);

  return (
    <ScrollView
      className="bg-background flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top }}
      {...scrollHandler}>

      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 }}>
        <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
          Analysis
        </Text>
        <Text style={{ color: textColor, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
          Statistics
        </Text>
      </View>

      {/* ── All-time hero row ── */}
      <View style={{ paddingHorizontal: 24, marginBottom: 16, gap: 10 }}>
        {/* Net balance — full width hero */}
        <View style={{
          backgroundColor: allTimeNet >= 0 ? (isDark ? 'rgba(0,250,217,0.1)' : 'rgba(0,200,175,0.08)') : 'rgba(255,59,48,0.08)',
          borderRadius: 20, borderWidth: 1,
          borderColor: allTimeNet >= 0 ? (isDark ? 'rgba(0,250,217,0.25)' : 'rgba(0,200,175,0.2)') : 'rgba(255,59,48,0.25)',
          padding: 20,
        }}>
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
            All-time net balance
          </Text>
          <Text style={{ color: allTimeNet >= 0 ? greenColor : redColor, fontSize: 32, fontWeight: '900', letterSpacing: -1.5 }}>
            {allTimeNet >= 0 ? '+' : ''}{fmt(allTimeNet)}
          </Text>
          <Text style={{ color: mutedColor, fontSize: 12, marginTop: 6 }}>
            {savingsRate}% savings rate · {allTrans.length} transactions total
          </Text>
        </View>

        {/* Income + Expenses side by side */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: primaryColor }} />
              <Text style={{ color: mutedColor, fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>Income</Text>
            </View>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}
              style={{ color: primaryColor, fontSize: 16, fontWeight: '700' }}>
              {fmt(allTimeIncome)}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: violetColor }} />
              <Text style={{ color: mutedColor, fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>Expenses</Text>
            </View>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}
              style={{ color: violetColor, fontSize: 16, fontWeight: '700' }}>
              {fmt(allTimeExpenses)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Month Comparison ── */}
      <View style={{ marginHorizontal: 24, marginBottom: 16, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 20 }}>
        <Text style={{ color: textColor, fontSize: 15, fontWeight: '700', marginBottom: 16 }}>
          Month comparison
        </Text>

        {/* Column headers */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ flex: 1.2 }} />
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <View style={{ backgroundColor: rgba(primaryColor, 0.1), borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ color: primaryColor, fontSize: 11, fontWeight: '700' }}>{MONTHS[currentMonth]}</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500' }}>{MONTHS[prevMonth]}</Text>
          </View>
          <View style={{ width: 56, alignItems: 'flex-end' }}>
            <Text style={{ color: mutedColor, fontSize: 11 }}>Δ</Text>
          </View>
        </View>

        {[
          { label: 'Income', current: currentIncome, prev: prevIncome, change: incomeChange, isPositiveGood: true },
          { label: 'Expenses', current: currentExpenses, prev: prevExpenses, change: expenseChange, isPositiveGood: false },
          { label: 'Net', current: currentNet, prev: prevNet, change: netChange, isPositiveGood: true },
        ].map((row, i) => (
          <View key={row.label} style={{
            flexDirection: 'row', alignItems: 'center', paddingVertical: 11,
            borderTopWidth: i === 0 ? 1 : 1, borderTopColor: borderColor,
          }}>
            <Text style={{ color: mutedColor, fontSize: 13, flex: 1.2 }}>{row.label}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}
              style={{ flex: 1, color: textColor, fontSize: 13, fontWeight: '700', textAlign: 'right' }}>
              {fmt(row.current)}
            </Text>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}
              style={{ flex: 1, color: mutedColor, fontSize: 12, textAlign: 'right' }}>
              {fmt(row.prev)}
            </Text>
            <View style={{ width: 56, alignItems: 'flex-end' }}>
              <DeltaBadge change={row.change} isPositiveGood={row.isPositiveGood} />
            </View>
          </View>
        ))}
      </View>

      {/* ── Chart ── */}
      <View style={{ marginHorizontal: 24, marginBottom: 16, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: textColor, fontSize: 15, fontWeight: '700' }}>
            {chartTab === 'bar' ? `${MONTHS[currentMonth]} by week` : '12-month trend'}
          </Text>
          <View style={{ flexDirection: 'row', backgroundColor: tabBg, borderRadius: 10, padding: 3 }}>
            {(['line', 'bar'] as ChartTab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setChartTab(tab)}
                style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, backgroundColor: chartTab === tab ? primaryColor : 'transparent' }}>
                <Ionicons
                  name={tab === 'bar' ? 'bar-chart-outline' : 'trending-up-outline'}
                  size={14}
                  color={chartTab === tab ? 'white' : mutedColor}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
          {[{ label: 'Income', color: primaryColor }, { label: 'Expenses', color: violetColor }].map((l) => (
            <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: l.color }} />
              <Text style={{ color: mutedColor, fontSize: 11 }}>{l.label}</Text>
            </View>
          ))}
        </View>

        {chartTab === 'bar' ? (
          <BarChart
            data={barData}
            width={CHART_WIDTH}
            height={180}
            barWidth={18}
            noOfSections={4}
            barBorderRadius={5}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={borderColor}
            yAxisTextStyle={{ color: mutedColor, fontSize: 10 }}
            rulesColor={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            rulesType="solid"
            isAnimated
          />
        ) : (
          <LineChart
            data={monthlyData.map((m) => ({ value: m.income, label: m.month, dataPointColor: primaryColor }))}
            data2={monthlyData.map((m) => ({ value: m.expenses, dataPointColor: violetColor }))}
            width={CHART_WIDTH}
            height={180}
            color1={primaryColor}
            color2={violetColor}
            thickness={2}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={borderColor}
            yAxisTextStyle={{ color: mutedColor, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: mutedColor, fontSize: 10 }}
            rulesColor={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            startFillColor1={primaryColor}
            startFillColor2={violetColor}
            endFillColor1="transparent"
            endFillColor2="transparent"
            startOpacity={0.15}
            endOpacity={0}
            areaChart
            curved
            isAnimated
          />
        )}
      </View>

      {/* ── Top spending categories ── */}
      {topCategories.length > 0 && (
        <View style={{ marginHorizontal: 24, marginBottom: 16, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 20 }}>
          <Text style={{ color: textColor, fontSize: 15, fontWeight: '700', marginBottom: 14 }}>
            Top expense categories
          </Text>
          {topCategories.map((cat, i) => (
            <View key={cat.name} style={{ marginBottom: i < topCategories.length - 1 ? 14 : 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: rgba(cat.color, 0.13), alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Ionicons name={(cat.icon as any) || 'grid-outline'} size={14} color={cat.color} />
                </View>
                <Text style={{ flex: 1, color: textColor, fontSize: 13, fontWeight: '600' }}>{cat.name}</Text>
                <Text style={{ color: cat.color, fontSize: 13, fontWeight: '700' }}>{fmt(cat.total)}</Text>
                <Text style={{ color: mutedColor, fontSize: 11, marginLeft: 8, width: 36, textAlign: 'right' }}>
                  {topCatTotal > 0 ? Math.round((cat.total / topCatTotal) * 100) : 0}%
                </Text>
              </View>
              <View style={{ height: 4, backgroundColor: isDark ? 'rgb(46,46,58)' : 'rgb(220,220,232)', borderRadius: 100, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${topCatTotal > 0 ? (cat.total / topCatTotal) * 100 : 0}%`, backgroundColor: cat.color, borderRadius: 100 }} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── Quick Stats ── */}
      <View style={{ paddingHorizontal: 24, marginBottom: 8 }}>
        <Text style={{ color: textColor, fontSize: 15, fontWeight: '700', marginBottom: 12 }}>
          Quick stats
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {[
            { label: 'Avg expense', value: avgExpense > 0 ? fmt(avgExpense) : '—', icon: 'calculator-outline' as const },
            { label: 'Biggest expense', value: biggestExpense > 0 ? fmt(biggestExpense) : '—', icon: 'arrow-up-circle-outline' as const },
            { label: 'Savings rate', value: `${savingsRate}%`, icon: 'wallet-outline' as const },
            { label: 'Most active day', value: mostActiveDay, icon: 'calendar-outline' as const },
          ].map((stat) => (
            <View key={stat.label} style={{ width: '47.5%', backgroundColor: cardBg, borderRadius: 14, borderWidth: 1, borderColor, padding: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 }}>
                <Ionicons name={stat.icon} size={13} color={mutedColor} />
                <Text style={{ color: mutedColor, fontSize: 11 }}>{stat.label}</Text>
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}
                style={{ color: textColor, fontSize: 16, fontWeight: '700' }}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}
