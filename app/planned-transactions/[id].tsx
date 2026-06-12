import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { AlertDialog } from '@/components/AlertDialog';
import { DetailCard } from '@/components/DetailCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as plannedTransactionService from '@/services/plannedTransactions';
import * as transactionService from '@/services/transactions';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColors, useCurrency, rgba } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';
import { PlannedTransactionDetailSkeleton } from '@/components/PlannedTransactionDetailSkeleton';

type DialogState = {
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
} | null;

export default function PlannedTransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, violetColor, redColor, isDark } = useThemeColors();
  const { format } = useCurrency();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [dialog, setDialog] = useState<DialogState>(null);

  const { data: results } = useLiveQuery(
    plannedTransactionService.getByIdWithCategory(id ?? '')
  );

  const ptx = results?.[0]?.plannedTransaction;
  const category = results?.[0]?.category;

  const { data: executions } = useLiveQuery(
    transactionService.getByPlannedTransaction(id ?? '')
  );

  if (!ptx) {
    return (
      <PlannedTransactionDetailSkeleton />
    );
  }

  const isExpense = ptx.type === 'EXPENSE';
  const heroBgColor = isExpense ? violetColor : primaryColor;
  const amountPrefix = isExpense ? '-' : '+';

  const handleDelete = () => {
    setDialog({
      title: t('global.dialogs.deletePlannedTitle'),
      description: t('global.dialogs.deletePlannedDesc'),
      confirmLabel: t('global.actions.delete'),
      destructive: true,
      onConfirm: async () => {
        try {
          await plannedTransactionService.softDelete(ptx.id);
          router.back();
        } catch {
          setDialog({ title: t('global.dialogs.error'), description: t('global.errors.deleteFailed') });
        }
      },
    });
  };

  const handleExecute = async () => {
    setDialog({
      title: t('global.actions.executeNow'),
      description: t('global.dialogs.executePlannedPrompt'),
      confirmLabel: t('global.actions.executeNow'),
      onConfirm: async () => {
        try {
          await plannedTransactionService.execute(ptx.id, 'BANK');
          setDialog({ title: t('global.dialogs.success'), description: t('global.dialogs.transactionExecuted') });
        } catch {
          setDialog({ title: t('global.dialogs.error'), description: t('global.errors.couldNotExecute') });
        }
      },
    });
  };

  const handleToggleActive = async () => {
    try {
      await plannedTransactionService.update(ptx.id, { isActive: !ptx.isActive });
    } catch {
      setDialog({ title: t('global.dialogs.error'), description: t('global.errors.couldNotUpdateStatus') });
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

  const isOverdue = ptx.isActive && ptx.nextExecutionDate && new Date(ptx.nextExecutionDate) < new Date();

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
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>{t('screens.plannedTransactions.title')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            onPress={() => router.push(`/planned-transactions/add?id=${ptx.id}`)}
            style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: cardBg, borderWidth: 1, borderColor, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="pencil-outline" size={18} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>


      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>

        {/* Top Hero Container Box */}
        <View style={{ backgroundColor: heroBgColor, borderRadius: 28, paddingVertical: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12 }}>
              <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>{ptx.type}</Text>
            </View>
            {isOverdue && (
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>{t('screens.plannedTransactions.overdue')}</Text>
              </View>
            )}
          </View>

          <Text style={{ color: '#FFF', fontSize: 44, fontWeight: '600', letterSpacing: -0.5 }}>
            {amountPrefix}{format(ptx.amount)}
          </Text>

          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 12, fontWeight: '500' }}>
            {t(`global.frequencies.${ptx.frequency}`)} · {ptx.recurring ? t('screens.plannedTransactions.recurring') : t('screens.plannedTransactions.oneTime')}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
            {t('screens.plannedTransactions.nextLabel')} {ptx.isActive ? formattedNextDate : t('screens.plannedTransactions.paused')}
          </Text>
        </View>

        {/* Action Feature Buttons Row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleExecute}
            activeOpacity={0.7}
            disabled={!ptx.isActive}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: ptx.isActive ? (isExpense ? primaryColor : violetColor) : 'rgba(131, 131, 156, 0.15)', borderRadius: 16, paddingVertical: 14, gap: 8, opacity: ptx.isActive ? 1 : 0.5 }}>
            <Ionicons name="flash-sharp" size={18} color={ptx.isActive ? 'white' : mutedColor} />
            <Text style={{ color: ptx.isActive ? 'white' : mutedColor, fontSize: 14, fontWeight: '600' }}>{t('global.actions.executeNow')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleActive}
            activeOpacity={0.7}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: cardBg, borderWidth: 1, borderColor, borderRadius: 16, paddingVertical: 14, gap: 8 }}>
            <Ionicons name={ptx.isActive ? 'pause-sharp' : 'play-sharp'} size={18} color={textColor} />
            <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>
              {ptx.isActive ? t('global.actions.pause') : t('global.actions.resume')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Parameters Block */}
        <DetailCard.Container style={{ marginBottom: 24 }}>
          <DetailCard.Row
            icon={<Text style={{ color: textColor, fontSize: 15, fontWeight: '600' }}>Aa</Text>}
            iconBg={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'}
          >
            <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>{t('screens.transactions.description')}</Text>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{ptx.description}</Text>
          </DetailCard.Row>

          <DetailCard.Divider />

          <DetailCard.Row
            icon={<Ionicons name={(category?.icon as any) || 'grid'} size={20} color={category?.color || mutedColor} />}
            iconBg={category ? rgba(category.color, 0.15) : 'rgba(0,0,0,0.04)'}
          >
            <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>{t('screens.transactions.category')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: category?.color || mutedColor }} />
              <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{category?.name || t('tabs.categories.uncategorized')}</Text>
            </View>
          </DetailCard.Row>

          <DetailCard.Divider />

          <DetailCard.Row
            icon={<Ionicons name="calendar-sharp" size={20} color={textColor} />}
            iconBg={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'}
          >
            <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>{t('screens.plannedTransactions.startDate')}</Text>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{formattedStartDate}</Text>
          </DetailCard.Row>
        </DetailCard.Container>

        {/* Execution History Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12, marginLeft: 4 }}>
            {t('screens.plannedTransactions.executionHistory')} ({executions?.length || 0})
          </Text>

          {executions && executions.length > 0 ? (
            <DetailCard.Container>
              {executions.map((exec, id) => {
                const formattedExecDate = new Date(exec.transactionDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <View key={exec.id}>
                    <TouchableOpacity
                      onPress={() => router.push(`/transactions/${exec.id}`)}
                      activeOpacity={0.7}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: category?.color || primaryColor, marginRight: 14, marginLeft: 4 }} />
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }} numberOfLines={1}>
                          {formattedExecDate}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ color: exec.type === 'INCOME' ? violetColor : primaryColor, fontSize: 16, fontWeight: '600' }}>
                          {exec.type === 'INCOME' ? '+' : '-'}{format(exec.amount)}
                        </Text>
                        <Ionicons name="chevron-forward-sharp" size={16} color={mutedColor} />
                      </View>
                    </TouchableOpacity>
                    {id < executions.length - 1 && (
                      <DetailCard.Divider />
                    )}
                  </View>
                );
              })}
            </DetailCard.Container>
          ) : (
            <View style={{ backgroundColor: cardBg, borderRadius: 24, borderWidth: 1, borderColor, padding: 32, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="receipt-sharp" size={28} color={mutedColor} style={{ marginBottom: 8 }} />
              <Text style={{ color: mutedColor, fontSize: 14 }}>{t('screens.plannedTransactions.noExecutions')}</Text>
            </View>
          )}
        </View>

        {/* Delete Row Card Box Layout */}
        <DetailCard.Container style={{ borderColor: isDark ? 'rgba(255,59,48,0.15)' : borderColor }}>
          <DetailCard.Row
            icon={<Ionicons name="trash-sharp" size={20} color={redColor} />}
            iconBg="rgba(255,59,48,0.1)"
            onPress={handleDelete}
            showChevron
            chevronColor={redColor}
          >
            <Text style={{ color: redColor, fontSize: 16, fontWeight: '600' }}>
              {t('screens.plannedTransactions.deletePlanned')}
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
