import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as plannedTransactionService from '@/services/plannedTransactions';
import type { PlannedTransaction } from '@/db/schema';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeColors, useCurrency } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';
import { FilterChips } from '@/components/home/FilterChips';
import { PlannedTransactionCard } from '@/components/home/PlannedTransactionCard';

type TypeFilter = 'ALL' | 'INCOME' | 'EXPENSE';
type FreqFilter = 'ALL' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
type StatusFilter = 'ALL' | 'OVERDUE' | 'ACTIVE' | 'INACTIVE';

function isOverdue(p: PlannedTransaction): boolean {
  const nextDate = new Date(p.nextExecutionDate || p.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextDate < today && p.isActive;
}

export default function PlannedTransactionsScreen() {
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, isDark } = useThemeColors();
  const { format } = useCurrency();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { data: planned } = useLiveQuery(plannedTransactionService.getAll());

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [freqFilter, setFreqFilter] = useState<FreqFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const typeOptions = useMemo(() => [
    { label: t('global.filterLabels.all'), value: 'ALL' as TypeFilter },
    { label: t('tabs.categories.tabIncome'), value: 'INCOME' as TypeFilter },
    { label: t('tabs.categories.tabExpenses'), value: 'EXPENSE' as TypeFilter },
  ], [t]);

  const freqOptions = useMemo(() => [
    { label: t('global.filterLabels.allFrequencies'), value: 'ALL' as FreqFilter },
    { label: t('global.frequencies.DAILY'), value: 'DAILY' as FreqFilter },
    { label: t('global.frequencies.WEEKLY'), value: 'WEEKLY' as FreqFilter },
    { label: t('global.frequencies.MONTHLY'), value: 'MONTHLY' as FreqFilter },
    { label: t('global.frequencies.YEARLY'), value: 'YEARLY' as FreqFilter },
  ], [t]);

  const statusOptions = useMemo(() => [
    { label: t('global.filterLabels.all'), value: 'ALL' as StatusFilter },
    { label: t('global.filterLabels.overdue'), value: 'OVERDUE' as StatusFilter },
    { label: t('global.filterLabels.active'), value: 'ACTIVE' as StatusFilter },
    { label: t('global.filterLabels.inactive'), value: 'INACTIVE' as StatusFilter },
  ], [t]);

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
          <Text style={{ color: textColor, fontSize: 18, fontWeight: '700' }}>{t('screens.plannedTransactions.listTitle')}</Text>
          {overdueCount > 0 && (
            <View style={{ backgroundColor: 'rgba(255,59,48,0.12)', borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: 'rgb(255,59,48)', fontSize: 11, fontWeight: '700' }}>{t('screens.plannedTransactions.overdueCount', { count: overdueCount })}</Text>
            </View>
          )}
        </View>
        {hasActiveFilter && (
          <TouchableOpacity onPress={() => { setSearch(''); setTypeFilter('ALL'); setFreqFilter('ALL'); setStatusFilter('ALL'); }}>
            <Text style={{ color: primaryColor, fontSize: 13, fontWeight: '600' }}>{t('screens.transactions.clear')}</Text>
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
            placeholder={t('global.placeholders.searchPlanned')}
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
          <FilterChips options={statusOptions} selected={statusFilter} onSelect={setStatusFilter} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <FilterChips options={typeOptions} selected={typeFilter} onSelect={setTypeFilter} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <FilterChips options={freqOptions} selected={freqFilter} onSelect={setFreqFilter} />
        </View>
      </View>

      {/* Summary */}
      <View style={{ flexDirection: 'row', gap: 8, marginHorizontal: 20, marginBottom: 12 }}>
        {[
          { label: t('screens.plannedTransactions.committed'), value: committedExpenses, color: isDark ? 'rgb(255,121,102)' : 'rgb(255,100,80)' },
          { label: t('screens.plannedTransactions.expected'), value: expectedIncome, color: isDark ? 'rgb(173,123,255)' : 'rgb(140,90,220)' },
          { label: t('screens.plannedTransactions.count'), value: filtered.length, color: textColor, isCount: true },
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
                  <Text style={{ color: 'rgb(255,59,48)', fontSize: 11, fontWeight: '600' }}>{t('screens.plannedTransactions.late', { count: overdueCount })}</Text>
                )}
              </Text>
            ) : (
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}
                style={{ color: item.color, fontSize: 14, fontWeight: '700' }}>
                {format(item.value as number)}
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
            <Text style={{ color: mutedColor, fontSize: 14, marginTop: 12 }}>{t('screens.plannedTransactions.emptyTitle')}</Text>
            {hasActiveFilter && (
              <Text style={{ color: mutedColor, fontSize: 12, marginTop: 4 }}>{t('screens.plannedTransactions.emptyHint')}</Text>
            )}
          </View>
        ) : (
          filtered.map((p) => <PlannedTransactionCard key={p.id} item={p} />)
        )}
      </ScrollView>
    </View>
  );
}
