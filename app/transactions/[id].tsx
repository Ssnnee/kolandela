import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { AlertDialog } from '@/components/AlertDialog';
import { DetailCard } from '@/components/DetailCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as transactionService from '@/services/transactions';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColors, useCurrency, rgba } from '@/components/home/useThemeColors';

const PAYMENT_LABELS: Record<string, string> = {
  BANK: 'Bank transfer',
  CASH: 'Cash',
  MOBILE_MONEY: 'Mobile Money',
  OTHER: 'Other',
};

const PAYMENT_ICONS: Record<string, string> = {
  BANK: 'card',
  CASH: 'cash',
  MOBILE_MONEY: 'phone-portrait',
  OTHER: 'ellipsis-horizontal-circle',
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
  const { format } = useCurrency();
  const insets = useSafeAreaInsets();
  const [dialog, setDialog] = useState<DialogState>(null);

  const { data: results } = useLiveQuery(
    transactionService.getByIdWithCategory(id)
  );

  const tx = results?.[0]?.transaction;
  const category = results?.[0]?.category;
  const plannedTx = results?.[0]?.plannedTransaction;

  if (!tx) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textColor }}>Loading transaction details…</Text>
      </View>
    );
  }

  const isIncome = tx.type === 'INCOME';
  const heroBgColor = isIncome ? violetColor : primaryColor;
  const amountPrefix = isIncome ? '+' : '-';

  const handleDelete = () => {
    setDialog({
      title: 'Delete Transaction',
      description: 'Are you sure you want to delete this transaction?',
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: async () => {
        try {
          await transactionService.softDelete(tx.id);
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

  const formattedTime = new Date(tx.transactionDate).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', paddingTop: insets.top }}>
      {/* Header Bar */}
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
        </View>
      </View>


      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>

        {/* Top Hero Card Box */}
        <View style={{ backgroundColor: heroBgColor, borderRadius: 28, paddingVertical: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12, marginBottom: 12 }}>
            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>{tx.type}</Text>
          </View>
          <Text style={{ color: '#FFF', fontSize: 44, fontWeight: '600', letterSpacing: -0.5 }}>
            {amountPrefix}{format(tx.amount)}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 12, fontWeight: '400' }}>
            {formattedDate}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
            {formattedTime}
          </Text>
        </View>

        {/* Main Parameters Block */}
        <DetailCard.Container style={{ marginBottom: 16 }}>
          <DetailCard.Row
            icon={<Text style={{ color: textColor, fontSize: 15, fontWeight: '600' }}>Aa</Text>}
            iconBg={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'}
          >
            <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>Description</Text>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{tx.description}</Text>
          </DetailCard.Row>

          <DetailCard.Divider />

          <DetailCard.Row
            icon={<Ionicons name={(category?.icon as any) || 'grid'} size={20} color={category?.color || mutedColor} />}
            iconBg={category ? rgba(category.color, 0.15) : 'rgba(0,0,0,0.04)'}
          >
            <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>Category</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: category?.color || mutedColor }} />
              <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{category?.name || 'Uncategorized'}</Text>
            </View>
          </DetailCard.Row>

          <DetailCard.Divider />

          <DetailCard.Row
            icon={<Ionicons name={(PAYMENT_ICONS[tx.paymentMethod] as any) || 'card'} size={20} color={textColor} />}
            iconBg={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'}
          >
            <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>Payment method</Text>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{PAYMENT_LABELS[tx.paymentMethod] || tx.paymentMethod}</Text>
          </DetailCard.Row>
        </DetailCard.Container>

        {/* Dynamic Forwarding "From Planned" Card Block */}
        {plannedTx && (
          <DetailCard.Container style={{ marginBottom: 16 }}>
            <DetailCard.Row
              icon={<Ionicons name="repeat-sharp" size={20} color={violetColor} />}
              iconBg={isDark ? 'rgba(140,90,220,0.15)' : 'rgba(140,90,220,0.1)'}
              onPress={() => router.push(`/planned-transactions/${plannedTx.id}`)}
              showChevron
            >
              <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>From planned</Text>
              <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }} numberOfLines={1}>
                {plannedTx.description}
              </Text>
            </DetailCard.Row>
          </DetailCard.Container>
        )}

        {/* Delete Interactive Row Card */}
        <DetailCard.Container style={{ borderColor: isDark ? 'rgba(255,59,48,0.15)' : borderColor }}>
          <DetailCard.Row
            icon={<Ionicons name="trash-sharp" size={20} color={redColor} />}
            iconBg="rgba(255,59,48,0.1)"
            onPress={handleDelete}
            showChevron
            chevronColor={redColor}
          >
            <Text style={{ color: redColor, fontSize: 16, fontWeight: '600' }}>
              Delete transaction
            </Text>
          </DetailCard.Row>
        </DetailCard.Container>

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
