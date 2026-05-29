import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as transactionService from '@/services/transactions';
import * as categoryService from '@/services/categories';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColors, useCurrency } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';
import { FilterChips } from '@/components/home/FilterChips';
import { TransactionCard } from '@/components/home/TransactionCard';

type TypeFilter = 'ALL' | 'INCOME' | 'EXPENSE';
type PaymentFilter = 'ALL' | 'CASH' | 'BANK' | 'MOBILE_MONEY' | 'OTHER';

export default function TransactionsScreen() {
  const params = useLocalSearchParams<{ month?: string; year?: string }>();
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, violetColor, isDark } = useThemeColors();
  const { format } = useCurrency();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { data: trans } = useLiveQuery(transactionService.getAll());
  const { data: cats } = useLiveQuery(categoryService.getAll());

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('ALL');

  const initialMonth = params.month != null ? Number(params.month) : null;
  const initialYear = params.year != null ? Number(params.year) : null;
  const [monthScope, setMonthScope] = useState<{ month: number; year: number } | null>(
    initialMonth != null && initialYear != null ? { month: initialMonth, year: initialYear } : null
  );

  const typeOptions = useMemo(() => [
    { label: t('global.filterLabels.all'), value: 'ALL' as TypeFilter },
    { label: t('tabs.categories.tabIncome'), value: 'INCOME' as TypeFilter },
    { label: t('tabs.categories.tabExpenses'), value: 'EXPENSE' as TypeFilter },
  ], [t]);

  const paymentOptions = useMemo(() => [
    { label: t('global.filterLabels.allMethods'), value: 'ALL' as PaymentFilter },
    { label: t('global.paymentOptions.BANK'), value: 'BANK' as PaymentFilter },
    { label: t('global.paymentOptions.CASH'), value: 'CASH' as PaymentFilter },
    { label: t('global.paymentOptions.MOBILE_MONEY'), value: 'MOBILE_MONEY' as PaymentFilter },
    { label: t('global.paymentOptions.OTHER'), value: 'OTHER' as PaymentFilter },
  ], [t]);

  const categoryOptions = useMemo(() => {
    const opts: { label: string; value: string | null }[] = [{ label: t('global.filterLabels.allCategories'), value: null }];
    (cats ?? []).filter((c) => !c.isDeleted).forEach((c) => opts.push({ label: c.name, value: c.id }));
    return opts;
  }, [cats, t]);

  const filtered = useMemo(() => {
    return (trans ?? [])
      .filter((t) => {
        if (t.isDeleted) return false;
        if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
        if (categoryFilter !== null && t.categoryId !== categoryFilter) return false;
        if (paymentFilter !== 'ALL' && t.paymentMethod !== paymentFilter) return false;
        if (search.trim() && !t.description.toLowerCase().includes(search.trim().toLowerCase())) return false;
        if (monthScope) {
          const d = new Date(t.transactionDate);
          if (d.getMonth() !== monthScope.month || d.getFullYear() !== monthScope.year) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }, [trans, typeFilter, categoryFilter, paymentFilter, search, monthScope]);

  const totalIncome = useMemo(
    () => filtered.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
    [filtered]
  );
  const totalExpenses = useMemo(
    () => filtered.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    [filtered]
  );

  const hasActiveFilter = typeFilter !== 'ALL' || categoryFilter !== null || paymentFilter !== 'ALL' || search.trim() !== '' || monthScope !== null;

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
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>{t('screens.transactions.listTitle')}</Text>
        {hasActiveFilter && (
          <TouchableOpacity onPress={() => { setSearch(''); setTypeFilter('ALL'); setCategoryFilter(null); setPaymentFilter('ALL'); setMonthScope(null); }}>
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
            placeholder={t('global.placeholders.searchTransactions')}
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
          <FilterChips options={typeOptions} selected={typeFilter} onSelect={setTypeFilter} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <FilterChips options={categoryOptions} selected={categoryFilter} onSelect={setCategoryFilter} />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <FilterChips options={paymentOptions} selected={paymentFilter} onSelect={setPaymentFilter} />
        </View>
      </View>

      {/* Summary */}
      <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 12, backgroundColor: cardBg, borderRadius: 14, borderWidth: 1, borderColor, overflow: 'hidden' }}>
        {[
          { label: t('tabs.stats.income'), value: totalIncome, color: isDark ? 'rgb(173,123,255)' : 'rgb(140,90,220)' },
          { label: t('tabs.stats.expenses'), value: totalExpenses, color: isDark ? 'rgb(255,121,102)' : 'rgb(255,100,80)' },
          { label: t('tabs.stats.net'), value: totalIncome - totalExpenses, color: totalIncome - totalExpenses >= 0 ? (isDark ? 'rgb(0,250,217)' : 'rgb(0,200,175)') : 'rgb(255,59,48)' },
        ].map((item, i) => (
          <View key={item.label} style={{ flex: 1, alignItems: 'center', padding: 12, borderLeftWidth: i > 0 ? 1 : 0, borderLeftColor: borderColor }}>
            <Text style={{ color: mutedColor, fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              {item.label}
            </Text>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}
              style={{ color: item.color, fontSize: 13, fontWeight: '700' }}>
              {item.label === 'Net' && totalIncome - totalExpenses > 0 ? '+' : ''}{format(item.value)}
            </Text>
          </View>
        ))}
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="receipt-outline" size={40} color={mutedColor} />
            <Text style={{ color: mutedColor, fontSize: 14, marginTop: 12 }}>{t('screens.transactions.emptyTitle')}</Text>
            {hasActiveFilter && (
              <Text style={{ color: mutedColor, fontSize: 12, marginTop: 4 }}>{t('screens.transactions.emptyHint')}</Text>
            )}
          </View>
        ) : (
          filtered.map((t) => (
            <TransactionCard
              key={t.id}
              id={t.id}
              description={t.description}
              amount={t.amount}
              type={t.type as 'INCOME' | 'EXPENSE'}
              transactionDate={t.transactionDate}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
