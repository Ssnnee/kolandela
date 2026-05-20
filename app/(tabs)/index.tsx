import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { transactions, plannedTransactions } from '@/db/schema';
import { useScrollHandler } from '@/lib/useScrollHandler';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeColors } from '@/components/home/useThemeColors';
import { MonthPicker, buildMonthOptions } from '@/components/home/MonthPicker';
import { SummaryCards } from '@/components/home/SummaryCards';
import { SpendProgress } from '@/components/home/SpendProgress';
import { TransactionCard } from '@/components/home/TransactionCard';
import { PlannedTransactionCard } from '@/components/home/PlannedTransactionCard';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
type ListTab = 'transactions' | 'planned';

export default function Index() {
  const { isDark, textColor, mutedColor, primaryColor, cardBg, tabBg } = useThemeColors();
  const { data: trans } = useLiveQuery(db.select().from(transactions));
  const { data: plannedTrans } = useLiveQuery(db.select().from(plannedTransactions));
  const scrollHandler = useScrollHandler();

  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [listTab, setListTab] = useState<ListTab>('transactions');
  const monthOptions = useMemo(() => buildMonthOptions(), []);

  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const monthlyTrans = useMemo(
    () =>
      (trans ?? []).filter((t) => {
        const d = new Date(t.transactionDate);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear && !t.isDeleted;
      }),
    [trans, selectedMonth, selectedYear]
  );

  const income = useMemo(
    () => monthlyTrans.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
    [monthlyTrans]
  );
  const expenses = useMemo(
    () => monthlyTrans.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
    [monthlyTrans]
  );
  const remaining = income - expenses;
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;

  const monthlyPlanned = useMemo(
    () =>
      (plannedTrans ?? [])
        .filter((p) => {
          if (p.isDeleted || !p.isActive) return false;
          const start = new Date(p.startDate);
          const end = p.endDate ? new Date(p.endDate) : null;
          const monthStart = new Date(selectedYear, selectedMonth, 1);
          const monthEnd = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
          if (start > monthEnd) return false;
          if (end && end < monthStart) return false;
          return true;
        })
        .sort((a, b) => {
          const dateA = new Date(a.nextExecutionDate || a.startDate).getTime();
          const dateB = new Date(b.nextExecutionDate || b.startDate).getTime();
          return dateA - dateB;
        }),
    [plannedTrans, selectedMonth, selectedYear]
  );

  const plannedExpensesTotal = useMemo(
    () => monthlyPlanned.filter((p) => p.type === 'EXPENSE').reduce((s, p) => s + p.amount, 0),
    [monthlyPlanned]
  );

  const recentTrans = useMemo(
    () =>
      [...monthlyTrans]
        .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
        .slice(0, 5),
    [monthlyTrans]
  );

  return (
    <ScrollView
      className="bg-background flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
      {...scrollHandler}>

      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 }}>
        <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
          Overview
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

      <SummaryCards
        income={income}
        expenses={expenses}
        remaining={remaining}
        savingsRate={savingsRate}
      />

      <SpendProgress
        income={income}
        expenses={expenses}
        planned={plannedExpensesTotal}
      />

      {/* Recent / Planned section */}
      <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
        {/* Section header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: textColor, fontSize: 15, fontWeight: '700' }}>
            {listTab === 'transactions' ? 'Recent' : 'Planned'}
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: listTab === 'transactions' ? '/transactions' : '/planned-transactions',
                params: { month: selectedMonth, year: selectedYear },
              })
            }>
            <Text style={{ color: primaryColor, fontSize: 12, fontWeight: '600' }}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Tab switcher */}
        <View style={{ flexDirection: 'row', backgroundColor: tabBg, borderRadius: 14, padding: 4, marginBottom: 16 }}>
          {(['transactions', 'planned'] as ListTab[]).map((tab) => {
            const isActive = listTab === tab;
            const label = tab === 'transactions'
              ? 'Transactions'
              : `Planned${monthlyPlanned.length > 0 ? ` (${monthlyPlanned.length})` : ''}`;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setListTab(tab)}
                style={{
                  flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 11,
                  backgroundColor: isActive ? cardBg : 'transparent',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isActive ? (isDark ? 0.3 : 0.08) : 0,
                  shadowRadius: 3,
                  elevation: isActive ? 2 : 0,
                }}>
                <Text style={{ fontSize: 13, fontWeight: isActive ? '700' : '500', color: isActive ? textColor : mutedColor }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Transactions list */}
        {listTab === 'transactions' && (
          recentTrans.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Ionicons name="receipt-outline" size={36} color={mutedColor} />
              <Text style={{ color: mutedColor, fontSize: 13, marginTop: 10 }}>No transactions this month</Text>
            </View>
          ) : (
            recentTrans.map((t) => (
              <TransactionCard
                key={t.id}
                description={t.description}
                amount={t.amount}
                type={t.type as 'INCOME' | 'EXPENSE'}
                transactionDate={t.transactionDate}
              />
            ))
          )
        )}

        {/* Planned list */}
        {listTab === 'planned' && (
          monthlyPlanned.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Ionicons name="calendar-outline" size={36} color={mutedColor} />
              <Text style={{ color: mutedColor, fontSize: 13, marginTop: 10 }}>No planned transactions this month</Text>
            </View>
          ) : (
            monthlyPlanned.map((p) => <PlannedTransactionCard key={p.id} item={p} />)
          )
        )}
      </View>
    </ScrollView>
  );
}
