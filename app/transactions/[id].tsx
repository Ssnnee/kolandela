import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { AlertDialog } from '@/components/AlertDialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '@/db';
import { transactions, categories, plannedTransactions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColors, fmt, rgba } from '@/components/home/useThemeColors';

const PAYMENT_LABELS: Record<string, string> = {
  BANK: 'Bank Transfer',
  CASH: 'Cash',
  MOBILE_MONEY: 'Mobile Money',
  OTHER: 'Other',
};

const PAYMENT_ICONS: Record<string, string> = {
  BANK: 'card-outline',
  CASH: 'cash-outline',
  MOBILE_MONEY: 'phone-portrait-outline',
  OTHER: 'ellipsis-horizontal-circle-outline',
};

type DialogState = {
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
} | null;

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, violetColor, redColor, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();
  const [dialog, setDialog] = useState<DialogState>(null);

  const { data: results } = useLiveQuery(
    db.select({
      transaction: transactions,
      category: categories,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.id, id))
  );

  const tx = results?.[0]?.transaction;
  const category = results?.[0]?.category;

  const { data: plannedResults } = useLiveQuery(
    db.select().from(plannedTransactions).where(eq(plannedTransactions.id, tx?.plannedTransactionId ?? ''))
  );
  const plannedTx = plannedResults?.[0];

  if (!tx) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textColor }}>Loading transaction details…</Text>
      </View>
    );
  }

  const isIncome = tx.type === 'INCOME';
  const amountColor = isIncome ? primaryColor : violetColor;
  const amountPrefix = isIncome ? '+' : '-';

  const handleDelete = () => {
    setDialog({
      title: 'Delete Transaction',
      description: 'Are you sure you want to delete this transaction?',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        try {
          await db.update(transactions)
            .set({ isDeleted: true, deletedAt: new Date() })
            .where(eq(transactions.id, tx.id));
          router.back();
        } catch {
          setDialog({ title: 'Error', description: 'Could not delete transaction.' });
        }
      },
    });
  };

  const formattedDate = new Date(tx.transactionDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>Transaction</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            onPress={() => router.push(`/transactions/add?id=${tx.id}`)}
            style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: cardBg, borderWidth: 1, borderColor, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="pencil-outline" size={18} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: cardBg, borderWidth: 1, borderColor, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="trash-outline" size={18} color={redColor} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>
        {/* Hero Amount */}
        <View style={{ alignItems: 'center', marginVertical: 32 }}>
          <Text style={{ color: amountColor, fontSize: 44, fontWeight: '800', letterSpacing: -1 }}>
            {amountPrefix}{fmt(tx.amount)}
          </Text>
          <Text style={{ color: mutedColor, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
            Amount (XAF)
          </Text>
        </View>

        {/* Key details card */}
        <View style={{ backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 18, gap: 16 }}>
          {/* Description */}
          <View>
            <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              Description
            </Text>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '700' }}>
              {tx.description}
            </Text>
          </View>

          <View style={{ height: 1, backgroundColor: borderColor }} />

          {/* Date */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                Date
              </Text>
              <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>
                {formattedDate}
              </Text>
            </View>
            <Ionicons name="calendar-outline" size={20} color={mutedColor} />
          </View>

          <View style={{ height: 1, backgroundColor: borderColor }} />

          {/* Category */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                Category
              </Text>
              {category ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: rgba(category.color, 0.13), alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={(category.icon as any) || 'grid-outline'} size={16} color={category.color} />
                  </View>
                  <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>
                    {category.name}
                  </Text>
                </View>
              ) : (
                <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>Uncategorized</Text>
              )}
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: borderColor }} />

          {/* Payment Method */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                Payment Method
              </Text>
              <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>
                {PAYMENT_LABELS[tx.paymentMethod] || tx.paymentMethod}
              </Text>
            </View>
            <Ionicons name={(PAYMENT_ICONS[tx.paymentMethod] as any) || 'card-outline'} size={20} color={mutedColor} />
          </View>

          <View style={{ height: 1, backgroundColor: borderColor }} />

          {/* Type Badge */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Type
            </Text>
            <View style={{
              backgroundColor: isIncome
                ? 'rgba(0, 250, 217, 0.12)'
                : 'rgba(255, 59, 48, 0.12)',
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}>
              <Text style={{
                color: isIncome
                  ? (isDark ? 'rgb(0,250,217)' : 'rgb(0,180,150)')
                  : redColor,
                fontSize: 12,
                fontWeight: '700',
                textTransform: 'uppercase',
              }}>
                {tx.type}
              </Text>
            </View>
          </View>
        </View>

        {/* Linked planned transaction */}
        {plannedTx && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>
              Recurrence Link
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/planned-transactions/${plannedTx.id}`)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: cardBg,
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor,
                gap: 12,
              }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: isDark ? 'rgba(173,123,255,0.12)' : 'rgba(140,90,220,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="calendar-outline" size={16} color={violetColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
                  {plannedTx.description}
                </Text>
                <Text style={{ color: mutedColor, fontSize: 11, marginTop: 2 }}>
                  Executed from planned transaction
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={mutedColor} />
            </TouchableOpacity>
          </View>
        )}

        {/* Danger zone */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>
            Danger Zone
          </Text>
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(255,59,48,0.1)' : 'rgba(255,59,48,0.06)',
              borderRadius: 16,
              paddingVertical: 14,
              borderWidth: 1,
              borderColor: 'rgba(255,59,48,0.25)',
              gap: 8,
            }}>
            <Ionicons name="trash-outline" size={18} color={redColor} />
            <Text style={{ color: redColor, fontSize: 14, fontWeight: '700' }}>
              Delete Transaction
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <AlertDialog
        visible={dialog !== null}
        onOpenChange={() => setDialog(null)}
        title={dialog?.title ?? ''}
        description={dialog?.description}
        confirmLabel={dialog?.confirmLabel}
        destructive={dialog?.destructive}
        onConfirm={dialog?.onConfirm}
      />
    </View>
  );
}
