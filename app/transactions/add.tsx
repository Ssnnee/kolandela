import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AlertDialog } from '@/components/AlertDialog';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as transactionService from '@/services/transactions';
import * as categoryService from '@/services/categories';
import { useState, useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, useCurrency } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';
import { FormInput, FormPicker, CategoryPicker, DatePickerButton } from '@/components/forms';

type TxType = 'INCOME' | 'EXPENSE';
type PaymentMethod = 'CASH' | 'BANK' | 'MOBILE_MONEY' | 'OTHER';

export default function AddTransaction() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { textColor, mutedColor, primaryColor, violetColor, cardBg, borderColor, tabBg, isDark } = useThemeColors();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const [dialog, setDialog] = useState<{ title: string; description: string } | null>(null);

  const formatAmount = (val: string) => val ? val.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';
  const handleAmountChange = (text: string) => setAmount(text.replace(/\s/g, ''));

  const { data: cats } = useLiveQuery(categoryService.getAll());
  const { data: txList } = useLiveQuery(
    transactionService.getById(id ?? '')
  );
  const editingTx = id ? txList?.[0] : null;

  const [type, setType] = useState<TxType>('EXPENSE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK');
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [hasPrefilled, setHasPrefilled] = useState(false);

  useEffect(() => {
    if (editingTx && !hasPrefilled) {
      setType(editingTx.type);
      setDescription(editingTx.description);
      setAmount(editingTx.amount.toString());
      setCategoryId(editingTx.categoryId);
      setPaymentMethod(editingTx.paymentMethod);
      setDate(new Date(editingTx.transactionDate));
      setHasPrefilled(true);
    }
  }, [editingTx, hasPrefilled]);

  const filteredCats = (cats ?? []).filter((c) => !c.isDeleted && c.type === type);

  const paymentOptions = useMemo(() => [
    { label: t('global.paymentOptions.BANK'), value: 'BANK' as PaymentMethod },
    { label: t('global.paymentOptions.CASH'), value: 'CASH' as PaymentMethod },
    { label: t('global.paymentOptions.MOBILE_MONEY'), value: 'MOBILE_MONEY' as PaymentMethod },
    { label: t('global.paymentOptions.OTHER'), value: 'OTHER' as PaymentMethod },
  ], [t]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!description.trim()) e.description = t('global.validation.descriptionRequired');
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = t('global.validation.enterValidAmount');
    if (!categoryId) e.category = t('global.validation.selectCategory');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (id) {
        await transactionService.update(id, {
          description: description.trim(),
          amount: Math.round(Number(amount)),
          type,
          categoryId: categoryId!,
          paymentMethod,
          transactionDate: date,
        });
      } else {
        await transactionService.create({
          description: description.trim(),
          amount: Math.round(Number(amount)),
          type,
          categoryId: categoryId!,
          paymentMethod,
          transactionDate: date,
        });
      }
      router.back();
    } catch (e) {
      setDialog({ title: t('global.dialogs.error'), description: t('global.errors.couldNotSave') });
    } finally {
      setSaving(false);
    }
  };

  const accentColor = type === 'INCOME' ? violetColor : primaryColor;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: cardBg, borderWidth: 1, borderColor, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>{id ? t('screens.transactions.edit') : t('screens.transactions.new')}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{ backgroundColor: accentColor, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, opacity: saving ? 0.6 : 1 }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>{t('global.actions.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        {/* Type toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: tabBg, borderRadius: 14, padding: 4, marginBottom: 24 }}>
          {(['EXPENSE', 'INCOME'] as TxType[]).map((mode) => {
            const isActive = type === mode;
            const color = mode === 'INCOME' ? violetColor : primaryColor;
            return (
              <TouchableOpacity
                key={mode}
                onPress={() => { setType(mode); setCategoryId(null); }}
                style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11, backgroundColor: isActive ? color : 'transparent' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: isActive ? 'white' : mutedColor }}>
                  {mode === 'INCOME' ? t('tabs.categories.tabIncome') : t('tabs.categories.tabExpenses')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FormInput
          label={t('screens.transactions.description')}
          value={description}
          onChangeText={setDescription}
          placeholder={t('global.placeholders.transactionDescription')}
          error={errors.description}
        />

        <FormInput
          label={`${t('screens.transactions.amount')} (${currency.symbol})`}
          value={formatAmount(amount)}
          onChangeText={handleAmountChange}
          placeholder={t('global.placeholders.amount')}
          keyboardType="numeric"
          error={errors.amount}
        />

        <DatePickerButton
          label={t('screens.transactions.date')}
          date={date}
          onChange={setDate}
        />

        <CategoryPicker
          categories={filteredCats}
          selected={categoryId}
          onSelect={setCategoryId}
          error={errors.category}
        />

        <FormPicker
          label={t('screens.transactions.paymentMethod')}
          options={paymentOptions}
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />
      </ScrollView>

      <AlertDialog
        visible={dialog !== null}
        onOpenChange={() => setDialog(null)}
        title={dialog?.title ?? ''}
        description={dialog?.description}
      />
    </View>
  );
}
