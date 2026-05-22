import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { categories, transactions } from '@/db/schema';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, fmt, rgba } from '@/components/home/useThemeColors';
import { useScrollHandler } from '@/lib/useScrollHandler';
import { MonthPicker, buildMonthOptions } from '@/components/home/MonthPicker';
import { router } from 'expo-router';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
type Tab = 'EXPENSE' | 'INCOME';

export default function CategoriesScreen() {
  const { textColor, mutedColor, primaryColor, cardBg, borderColor, tabBg, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();
  const scrollHandler = useScrollHandler();

  const { data: cats } = useLiveQuery(db.select().from(categories));
  const { data: trans } = useLiveQuery(db.select().from(transactions));

  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [tab, setTab] = useState<Tab>('EXPENSE');
  const monthOptions = useMemo(() => buildMonthOptions(), []);

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const monthlyTrans = useMemo(
    () =>
      (trans ?? []).filter((t) => {
        if (t.isDeleted) return false;
        const d = new Date(t.transactionDate);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      }),
    [trans, selectedMonth, selectedYear]
  );

  const totalExpenses = useMemo(
    () => monthlyTrans.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    [monthlyTrans]
  );
  const totalIncome = useMemo(
    () => monthlyTrans.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
    [monthlyTrans]
  );
  const totalForTab = tab === 'EXPENSE' ? totalExpenses : totalIncome;

  const categoryBreakdown = useMemo(() => {
    const relevant = (cats ?? []).filter((c) => !c.isDeleted && c.type === tab);
    const tabTrans = monthlyTrans.filter((t) => t.type === tab);
    return relevant
      .map((cat) => {
        const catTrans = tabTrans.filter((t) => t.categoryId === cat.id);
        const total = catTrans.reduce((s, t) => s + t.amount, 0);
        const count = catTrans.length;
        const pct = totalForTab > 0 ? (total / totalForTab) * 100 : 0;
        return { ...cat, total, count, pct };
      })
      .filter((c) => c.count > 0)
      .sort((a, b) => b.total - a.total);
  }, [cats, monthlyTrans, tab, totalForTab]);

  const uncategorizedTotal = useMemo(() => {
    const categorizedIds = new Set((cats ?? []).map((c) => c.id));
    return monthlyTrans
      .filter((t) => t.type === tab && !categorizedIds.has(t.categoryId))
      .reduce((s, t) => s + t.amount, 0);
  }, [monthlyTrans, cats, tab]);

  const accentColor = tab === 'EXPENSE'
    ? isDark ? 'rgb(173,123,255)' : 'rgb(140,90,220)'
    : isDark ? 'rgb(255,121,102)' : 'rgb(255,100,80)';

  const spentPct = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
  const insight =
    spentPct > 90 ? '⚠️ Spending is very high'
      : spentPct > 70 ? '📊 Used most of budget'
        : spentPct > 40 ? '👍 Spending looks balanced'
          : totalExpenses === 0 ? 'No expenses recorded yet'
            : '🎯 Great control this month';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)' }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: insets.top }}
      {...scrollHandler}>

      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 }}>
        <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
          Breakdown
        </Text>
        <Text style={{ color: textColor, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
          {MONTHS[selectedMonth]} {selectedYear}
        </Text>
      </View>

      <MonthPicker
        options={monthOptions}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelect={setSelectedDate}
      />

      {/* Tab switcher */}
      <View style={{ flexDirection: 'row', backgroundColor: tabBg, borderRadius: 14, padding: 4, marginHorizontal: 24, marginBottom: 20 }}>
        {(['EXPENSE', 'INCOME'] as Tab[]).map((t) => {
          const isActive = tab === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={{
                flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 11,
                backgroundColor: isActive ? (isDark ? 'rgb(26,26,34)' : 'rgb(255,255,255)') : 'transparent',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isActive ? (isDark ? 0.3 : 0.08) : 0,
                shadowRadius: 3,
                elevation: isActive ? 2 : 0,
              }}>
              <Text style={{ fontSize: 13, fontWeight: isActive ? '700' : '500', color: isActive ? textColor : mutedColor }}>
                {t === 'EXPENSE' ? 'Expenses' : 'Income'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Overview card */}
      <View style={{ marginHorizontal: 24, marginBottom: 16, backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <View>
            <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
              Total {tab === 'EXPENSE' ? 'spent' : 'received'}
            </Text>
            <Text style={{ color: accentColor, fontSize: 26, fontWeight: '800', letterSpacing: -1 }}>
              {fmt(totalForTab)}
            </Text>
          </View>
          {tab === 'EXPENSE' && (
            <View style={{ backgroundColor: isDark ? 'rgb(38,38,47)' : 'rgb(235,235,242)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, maxWidth: 140 }}>
              <Text style={{ color: mutedColor, fontSize: 11, textAlign: 'right', lineHeight: 16 }}>
                {insight}
              </Text>
            </View>
          )}
        </View>
        {tab === 'EXPENSE' && totalIncome > 0 && (
          <>
            <View style={{ height: 7, backgroundColor: isDark ? 'rgb(46,46,58)' : 'rgb(220,220,232)', borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
              <View style={{
                height: '100%',
                width: `${Math.min(spentPct, 100)}%`,
                backgroundColor: spentPct > 90 ? 'rgb(255,59,48)' : spentPct > 70
                  ? (isDark ? 'rgb(255,121,102)' : 'rgb(255,100,80)')
                  : (isDark ? 'rgb(0,250,217)' : 'rgb(0,200,175)'),
                borderRadius: 100,
              }} />
            </View>
            <Text style={{ color: mutedColor, fontSize: 11 }}>
              {spentPct}% of {fmt(totalIncome)} income
            </Text>
          </>
        )}
      </View>

      {/* Category list */}
      <View style={{ paddingHorizontal: 24 }}>
        <Text style={{ color: textColor, fontSize: 15, fontWeight: '700', marginBottom: 12 }}>
          By category
        </Text>

        {categoryBreakdown.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Ionicons name="grid-outline" size={36} color={mutedColor} />
            <Text style={{ color: mutedColor, fontSize: 13, marginTop: 10 }}>
              No {tab === 'EXPENSE' ? 'expenses' : 'income'} this month
            </Text>
          </View>
        ) : (
          <>
            {categoryBreakdown.map((cat, i) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push(`/categories/${cat.id}`)}
                activeOpacity={0.7}
                style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 16, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: rgba(cat.color, 0.13), alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Ionicons name={(cat.icon as any) || 'grid-outline'} size={18} color={cat.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>{cat.name}</Text>
                    <Text style={{ color: mutedColor, fontSize: 11, marginTop: 1 }}>
                      {cat.count} transaction{cat.count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: cat.color, fontSize: 15, fontWeight: '700' }}>{fmt(cat.total)}</Text>
                    <Text style={{ color: mutedColor, fontSize: 11, marginTop: 1 }}>{cat.pct.toFixed(1)}%</Text>
                  </View>
                </View>
                <View style={{ height: 5, backgroundColor: isDark ? 'rgb(46,46,58)' : 'rgb(220,220,232)', borderRadius: 100, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${cat.pct}%`, backgroundColor: cat.color, borderRadius: 100 }} />
                </View>
              </TouchableOpacity>
            ))}

            {uncategorizedTotal > 0 && (
              <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 16, marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: isDark ? 'rgb(46,46,58)' : 'rgb(220,220,232)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Ionicons name="help-circle-outline" size={18} color={mutedColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>Uncategorized</Text>
                  </View>
                  <Text style={{ color: mutedColor, fontSize: 15, fontWeight: '700' }}>{fmt(uncategorizedTotal)}</Text>
                </View>
                <View style={{ height: 5, backgroundColor: isDark ? 'rgb(46,46,58)' : 'rgb(220,220,232)', borderRadius: 100, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${totalForTab > 0 ? (uncategorizedTotal / totalForTab) * 100 : 0}%`, backgroundColor: mutedColor, borderRadius: 100 }} />
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
