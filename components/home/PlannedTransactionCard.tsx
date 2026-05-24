import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as plannedTransactionService from '@/services/plannedTransactions';
import { useThemeColors, fmt, rgba } from './useThemeColors';
import type { PlannedTransaction } from '@/db/schema';

const FREQ_LABEL: Record<string, string> = {
  DAILY: 'Daily', WEEKLY: 'Weekly', MONTHLY: 'Monthly', YEARLY: 'Yearly',
};

function isOverdue(p: PlannedTransaction): boolean {
  const nextDate = new Date(p.nextExecutionDate || p.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return nextDate < today && p.isActive;
}

export function PlannedTransactionCard({ item }: { item: PlannedTransaction }) {
  const { textColor, mutedColor, primaryColor, violetColor, cardBg, borderColor, isDark } =
    useThemeColors();
  const [executed, setExecuted] = useState(false);

  const isExpense = item.type === 'EXPENSE';
  const overdue = isOverdue(item);
  const redColor = 'rgb(255,59,48)';
  const accentColor = overdue ? redColor : isExpense ? violetColor : primaryColor;
  const accentDim = overdue
    ? 'rgba(255,59,48,0.12)'
    : isExpense
      ? isDark ? 'rgba(173,123,255,0.12)' : 'rgba(140,90,220,0.1)'
      : isDark ? 'rgba(255,121,102,0.12)' : 'rgba(255,100,80,0.1)';

  const handleExecute = async () => {
    try {
      await plannedTransactionService.execute(item.id, 'BANK');
      setExecuted(true);
    } catch (e) {
      console.error('Execute error:', e);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/planned-transactions/${item.id}`)}
      activeOpacity={0.75}
      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: cardBg, borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: overdue ? 'rgba(255,59,48,0.35)' : borderColor }}>

      <View style={{ width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: accentDim, marginRight: 12 }}>
        <Ionicons name={isExpense ? 'calendar-outline' : 'trending-up-outline'} size={18} color={accentColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <View style={{ backgroundColor: accentDim, borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ color: accentColor, fontSize: 10, fontWeight: '600' }}>
              {FREQ_LABEL[item.frequency]}
            </Text>
          </View>
          {item.nextExecutionDate && (
            <Text style={{ color: overdue ? redColor : mutedColor, fontSize: 11 }}>
              {new Date(item.nextExecutionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </Text>
          )}
        </View>
      </View>

      <Text style={{ fontSize: 14, fontWeight: '700', color: accentColor, marginRight: 12 }}>
        {isExpense ? '-' : '+'}{fmt(item.amount)}
      </Text>

      <TouchableOpacity
        onPress={(e) => { e.stopPropagation?.(); handleExecute(); }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={executed ? {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: accentColor,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.35,
          shadowRadius: 4,
          elevation: 4,
        } : {
          width: 32,
          height: 32,
          borderRadius: 16,
          borderWidth: 2.5,
          borderColor: accentColor,
          backgroundColor: rgba(accentColor, 0.08),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {executed ? (
          <Ionicons name="checkmark" size={18} color="white" />
        ) : (
          <Ionicons name="ellipse" size={12} color={accentDim} />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
