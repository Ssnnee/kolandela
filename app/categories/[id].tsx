import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as categoryService from '@/services/categories';
import * as transactionService from '@/services/transactions';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColors, fmt, rgba } from '@/components/home/useThemeColors';
import { TransactionCard } from '@/components/home/TransactionCard';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, violetColor, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();

  const { data: categoryList } = useLiveQuery(
    categoryService.getById(id ?? '')
  );
  const category = categoryList?.[0];

  const { data: txList } = useLiveQuery(
    transactionService.getByCategory(id ?? '')
  );

  if (!category) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textColor }}>Loading category details…</Text>
      </View>
    );
  }

  const isIncome = category.type === 'INCOME';
  const typeColor = isIncome ? primaryColor : violetColor;

  const totalAmount = (txList ?? []).reduce((sum, t) => sum + t.amount, 0);
  const txCount = txList?.length ?? 0;
  const avgAmount = txCount > 0 ? Math.round(totalAmount / txCount) : 0;

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
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>Category Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>
        {/* Category Hero */}
        <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 28 }}>
          <View style={{
            width: 76,
            height: 76,
            borderRadius: 24,
            backgroundColor: rgba(category.color, 0.15),
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            borderWidth: 1,
            borderColor: rgba(category.color, 0.25),
          }}>
            <Ionicons name={(category.icon as any) || 'grid-outline'} size={32} color={category.color} />
          </View>
          <Text style={{ color: textColor, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            {category.name}
          </Text>
          <View style={{
            backgroundColor: isIncome ? 'rgba(0, 250, 217, 0.12)' : 'rgba(255, 59, 48, 0.12)',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
            marginTop: 6,
          }}>
            <Text style={{
              color: isIncome ? (isDark ? 'rgb(0,250,217)' : 'rgb(0,180,150)') : (isDark ? 'rgb(255,100,80)' : 'rgb(220,50,40)'),
              fontSize: 11,
              fontWeight: '700',
              textTransform: 'uppercase',
            }}>
              {category.type}
            </Text>
          </View>
        </View>

        {/* Stats Card */}
        <View style={{ backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 18, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: mutedColor, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              Total Volume
            </Text>
            <Text style={{ color: typeColor, fontSize: 18, fontWeight: '800' }}>
              {isIncome ? '+' : '-'}{fmt(totalAmount)}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: borderColor }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: mutedColor, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              Transactions
            </Text>
            <Text style={{ color: textColor, fontSize: 18, fontWeight: '800' }}>
              {txCount}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: borderColor }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: mutedColor, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              Average Tx
            </Text>
            <Text style={{ color: textColor, fontSize: 18, fontWeight: '800' }}>
              {fmt(avgAmount)}
            </Text>
          </View>
        </View>

        {/* Transaction History */}
        <View>
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginLeft: 4 }}>
            Transaction History
          </Text>

          {txList && txList.length > 0 ? (
            txList.map((tx) => (
              <TransactionCard
                key={tx.id}
                id={tx.id}
                description={tx.description}
                amount={tx.amount}
                type={tx.type as 'INCOME' | 'EXPENSE'}
                transactionDate={tx.transactionDate}
              />
            ))
          ) : (
            <View style={{ backgroundColor: cardBg, borderRadius: 18, borderWidth: 1, borderColor, padding: 32, alignItems: 'center' }}>
              <Ionicons name="receipt-outline" size={32} color={mutedColor} />
              <Text style={{ color: mutedColor, fontSize: 13, marginTop: 10 }}>
                No transactions recorded under this category
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
