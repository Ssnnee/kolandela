import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { AlertDialog } from '@/components/AlertDialog';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as plannedTransactionService from '@/services/plannedTransactions';
import * as transactionService from '@/services/transactions';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColors, fmt, rgba } from '@/components/home/useThemeColors';
import { TransactionCard } from '@/components/home/TransactionCard';

const FREQ_LABEL: Record<string, string> = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
};

type DialogState = {
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
} | null;

export default function PlannedTransactionDetailScreen() {
  const { idx } = useLocalSearchParams<{ idx: string }>();
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, violetColor, redColor, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();
  const [dialog, setDialog] = useState<DialogState>(null);

  const { data: results } = useLiveQuery(
    plannedTransactionService.getByIdWithCategory(idx)
  );

  const ptx = results?.[0]?.plannedTransaction;
  const category = results?.[0]?.category;

  const { data: executions } = useLiveQuery(
    transactionService.getByPlannedTransaction(idx)
  );

  if (!ptx) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textColor }}>Loading planned transaction details…</Text>
      </View>
    );
  }

  const isExpense = ptx.type === 'EXPENSE';
  const amountColor = isExpense ? violetColor : primaryColor;
  const amountPrefix = isExpense ? '-' : '+';

  const handleDelete = () => {
    setDialog({
      title: 'Delete Planned Transaction',
      description: 'Are you sure you want to delete this planned transaction?',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        try {
          await plannedTransactionService.softDelete(ptx.id);
          router.back();
        } catch {
          setDialog({ title: 'Error', description: 'Could not delete planned transaction.' });
        }
      },
    });
  };

  const handleExecute = async () => {
    setDialog({
      title: 'Execute Now',
      description: 'Do you want to record an execution for this planned transaction now?',
      confirmLabel: 'Execute',
      onConfirm: async () => {
        try {
          await plannedTransactionService.execute(ptx.id, 'BANK');
          setDialog({ title: 'Success', description: 'Transaction executed successfully.' });
        } catch {
          setDialog({ title: 'Error', description: 'Could not execute transaction.' });
        }
      },
    });
  };

  const handleToggleActive = async () => {
    try {
      await plannedTransactionService.update(ptx.id, { isActive: !ptx.isActive });
    } catch {
      setDialog({ title: 'Error', description: 'Could not update status.' });
    }
  };

  const formattedStartDate = new Date(ptx.startDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedNextDate = ptx.nextExecutionDate
    ? new Date(ptx.nextExecutionDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'None';

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
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>Planned Details</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            onPress={() => router.push(`/planned-transactions/add?id=${ptx.id}`)}
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
            {amountPrefix}{fmt(ptx.amount)}
          </Text>
          <Text style={{ color: mutedColor, fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
            Planned Amount
          </Text>
        </View>

        {/* Action Controls */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleExecute}
            disabled={!ptx.isActive}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: ptx.isActive ? amountColor : 'rgba(131, 131, 156, 0.2)',
              borderRadius: 14,
              paddingVertical: 12,
              gap: 8,
              opacity: ptx.isActive ? 1 : 0.6,
            }}>
            <Ionicons name="flash-outline" size={18} color="white" />
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>Execute Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleActive}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: cardBg,
              borderWidth: 1,
              borderColor,
              borderRadius: 14,
              paddingVertical: 12,
              gap: 8,
            }}>
            <Ionicons name={ptx.isActive ? 'pause-outline' : 'play-outline'} size={18} color={textColor} />
            <Text style={{ color: textColor, fontSize: 14, fontWeight: '700' }}>
              {ptx.isActive ? 'Pause' : 'Resume'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Key details card */}
        <View style={{ backgroundColor: cardBg, borderRadius: 20, borderWidth: 1, borderColor, padding: 18, gap: 16 }}>
          {/* Description */}
          <View>
            <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              Description
            </Text>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '700' }}>
              {ptx.description}
            </Text>
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

          {/* Frequency & Recurring */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                Frequency
              </Text>
              <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>
                {FREQ_LABEL[ptx.frequency]} {ptx.recurring ? '(Recurring)' : '(One-time)'}
              </Text>
            </View>
            <Ionicons name="repeat-outline" size={20} color={mutedColor} />
          </View>

          <View style={{ height: 1, backgroundColor: borderColor }} />

          {/* Next Execution */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                Next Execution
              </Text>
              <Text style={{ color: ptx.isActive ? textColor : mutedColor, fontSize: 14, fontWeight: '600' }}>
                {ptx.isActive ? formattedNextDate : 'Paused'}
              </Text>
            </View>
            <Ionicons name="time-outline" size={20} color={mutedColor} />
          </View>

          <View style={{ height: 1, backgroundColor: borderColor }} />

          {/* Start Date */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                Start Date
              </Text>
              <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>
                {formattedStartDate}
              </Text>
            </View>
            <Ionicons name="calendar-outline" size={20} color={mutedColor} />
          </View>

          <View style={{ height: 1, backgroundColor: borderColor }} />

          {/* Status Badge */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Status
            </Text>
            <View style={{
              backgroundColor: ptx.isActive
                ? 'rgba(0, 250, 217, 0.12)'
                : 'rgba(255, 59, 48, 0.12)',
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}>
              <Text style={{
                color: ptx.isActive
                  ? (isDark ? 'rgb(0,250,217)' : 'rgb(0,180,150)')
                  : redColor,
                fontSize: 12,
                fontWeight: '700',
                textTransform: 'uppercase',
              }}>
                {ptx.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Previous executions list */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>
            Previous Executions ({executions?.length || 0})
          </Text>

          {executions && executions.length > 0 ? (
            executions.map((exec) => (
              <TransactionCard
                key={exec.id}
                id={exec.id}
                description={exec.description}
                amount={exec.amount}
                type={exec.type as 'INCOME' | 'EXPENSE'}
                transactionDate={exec.transactionDate}
              />
            ))
          ) : (
            <View style={{ backgroundColor: cardBg, borderRadius: 16, borderWidth: 1, borderColor, padding: 20, alignItems: 'center' }}>
              <Ionicons name="receipt-outline" size={28} color={mutedColor} />
              <Text style={{ color: mutedColor, fontSize: 13, marginTop: 8 }}>
                No executions recorded yet
              </Text>
            </View>
          )}
        </View>

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
              Delete Planned Transaction
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
