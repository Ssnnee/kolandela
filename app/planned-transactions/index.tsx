import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { plannedTransactions } from '@/db/schema';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeColors, fmt } from '@/components/home/useThemeColors';
import { FilterChips } from '@/components/home/FilterChips';
import { PlannedTransactionCard } from '@/components/home/PlannedTransactionCard';

type TypeFilter = 'ALL' | 'INCOME' | 'EXPENSE';
type FreqFilter = 'ALL' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
type StatusFilter = 'ALL' | 'OVERDUE' | 'ACTIVE' | 'INACTIVE';

const TYPE_OPTIONS = [
  { label: 'All', value: 'ALL' as TypeFilter },
  { label: 'Income', value: 'INCOME' as TypeFilter },
  { label: 'Expense', value: 'EXPENSE' as TypeFilter },
];

const FREQ_OPTIONS = [
  { label: 'All frequencies', value: 'ALL' as FreqFilter },
  { label: 'Daily', value: 'DAILY' as FreqFilter },
  { label: 'Weekly', value: 'WEEKLY' as FreqFilter },
  { label: 'Monthly', value: 'MONTHLY' as FreqFilter },
  { label: 'Yearly', value: 'YEARLY' as FreqFilter },
];

const STATUS_OPTIONS = [
  { label: 'All', value: 'ALL' as StatusFilter },
  { label: 'Overdue', value: 'OVERDUE' as StatusFilter },
  { label: 'Active', value: 'ACTIVE' as StatusFilter },
  { label: 'Inactive', value: 'INACTIVE' as StatusFilter },
];

function isOverdue(p: typeof plannedTransactions.$inferSelect): boolean {
  const nextDate = new Date(p.nextExecutionDate || p.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextDate < today && p.isActive;
}

export default function PlannedTransactionsScreen() {
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, violetColor, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();

  const { data: planned } = useLiveQuery(db.select().from(plannedTransactions));

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [freqFilter, setFreqFilter] = useState<FreqFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const filtered = useMemo(() => {
    return (planned ?? [])
      .filter((p) => {
        if (p.isDeleted) return false;
        if (typeFilter !== 'ALL' && p.type !== typeFilter) return false;
        if (freqFilter !== 'ALL' && p.frequency !== freqFilter) return false;
        if (statusFilter === 'OVERDUE' && !isOverdue(p)) return false;
        if (statusFilter === 'ACTIVE' && (!p.isActive || isOverdue(p))) return false;
        if (statusFilter === 'INACTIVE' && p.isActive) return false;
        if (search.trim() && !p.description.toLowerCase().includes(search.trim().toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => {
        const overdueA = isOverdue(a);
        const overdueB = isOverdue(b);
        if (overdueA && !overdueB) return -1;
        if (!overdueA && overdueB) return 1;
        return new Date(a.nextExecutionDate || a.startDate).getTime() - new Date(b.nextExecutionDate || b.startDate).getTime();
      });
  }, [planned, typeFilter, freqFilter, statusFilter, search]);

  const overdueCount = useMemo(() => filtered.filter(isOverdue).length, [filtered]);

  const hasActiveFilter = typeFilter !== 'ALL' || freqFilter !== 'ALL' || statusFilter !== 'ALL' || search.trim() !== '';

  const committedExpenses = useMemo(
    () => filtered.filter((p) => p.type === 'EXPENSE').reduce((s, p) => s + p.amount, 0),
    [filtered]
  );
  const expectedIncome = useMemo(
    () => filtered.filter((p) => p.type === 'INCOME').reduce((s, p) => s + p.amount, 0),
    [filtered]
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: cardBg, borderWidth: 1, borderColor, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chevron-back" size={20} color={textColor} />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '700' }}>Planned</Text>
          {overdueCount > 0 && (
            <View style={{ backgroundColor: 'rgba(255,59,48,0.12)', borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: 'rgb(255,59,48)', fontSize: 11, fontWeight: '700' }}>{overdueCount} overdue</Text>
            </View>
          )}
        </View>
        {hasActiveFilter && (
          <TouchableOpacity onPress={() => { setSearch(''); setTypeFilter('ALL'); setFreqFilter('ALL'); setStatusFilter('ALL'); }}>
            <Text style={{ color: primaryColor, fontSize: 13, fontWeight: '600' }}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: cardBg, borderRadius: 14, borderWidth: 1, borderColor, paddingHorizontal: 14, gap: 10 }}>
          <Ionicons name="search-outline" size={17} color={mutedColor} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search planned…"
            placeholderTextColor={mutedColor}
            style={{ flex: 1, height: 44, color: textColor, fontSize: 14 }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={17} color={mutedColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={{ gap: 8, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <FilterChips options={STATUS_OPTIONS} selected={statusFilter} onSelect={setStatusFilter} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <FilterChips options={TYPE_OPTIONS} selected={typeFilter} onSelect={setTypeFilter} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <FilterChips options={FREQ_OPTIONS} selected={freqFilter} onSelect={setFreqFilter} />
        </View>
      </View>

      {/* Summary */}
      <View style={{ flexDirection: 'row', gap: 8, marginHorizontal: 20, marginBottom: 12 }}>
        {[
          { label: 'Committed', value: committedExpenses, color: isDark ? 'rgb(173,123,255)' : 'rgb(140,90,220)' },
          { label: 'Expected', value: expectedIncome, color: isDark ? 'rgb(255,121,102)' : 'rgb(255,100,80)' },
          { label: 'Count', value: filtered.length, color: textColor, isCount: true },
        ].map((item) => (
          <View key={item.label} style={{
            flex: 1, borderRadius: 12, borderWidth: 1,
            borderColor: item.label === 'Count' && overdueCount > 0 ? 'rgba(255,59,48,0.3)' : borderColor,
            backgroundColor: item.label === 'Count' && overdueCount > 0 ? 'rgba(255,59,48,0.08)' : cardBg,
            padding: 12,
          }}>
            <Text style={{ color: mutedColor, fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              {item.label}
            </Text>
            {item.isCount ? (
              <Text style={{ color: textColor, fontSize: 14, fontWeight: '700' }}>
                {filtered.length}
                {overdueCount > 0 && (
                  <Text style={{ color: 'rgb(255,59,48)', fontSize: 11, fontWeight: '600' }}> · {overdueCount} late</Text>
                )}
              </Text>
            ) : (
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}
                style={{ color: item.color, fontSize: 14, fontWeight: '700' }}>
                {fmt(item.value as number)}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="calendar-outline" size={40} color={mutedColor} />
            <Text style={{ color: mutedColor, fontSize: 14, marginTop: 12 }}>No planned transactions found</Text>
            {hasActiveFilter && (
              <Text style={{ color: mutedColor, fontSize: 12, marginTop: 4 }}>Try adjusting your filters</Text>
            )}
          </View>
        ) : (
          filtered.map((p) => <PlannedTransactionCard key={p.id} item={p} />)
        )}
      </ScrollView>
    </View>
  );
}
