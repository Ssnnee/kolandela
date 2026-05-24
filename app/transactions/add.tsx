import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AlertDialog } from '@/components/AlertDialog';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as transactionService from '@/services/transactions';
import * as categoryService from '@/services/categories';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/components/home/useThemeColors';
import { FormInput, FormPicker, CategoryPicker, DatePickerButton } from '@/components/forms';

type TxType = 'INCOME' | 'EXPENSE';
type PaymentMethod = 'CASH' | 'BANK' | 'MOBILE_MONEY' | 'OTHER';

const PAYMENT_OPTIONS = [
  { label: 'Bank', value: 'BANK' as PaymentMethod },
  { label: 'Cash', value: 'CASH' as PaymentMethod },
  { label: 'Mobile Money', value: 'MOBILE_MONEY' as PaymentMethod },
  { label: 'Other', value: 'OTHER' as PaymentMethod },
];

export default function AddTransaction() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { textColor, mutedColor, primaryColor, violetColor, cardBg, borderColor, tabBg, isDark } = useThemeColors();
  const [dialog, setDialog] = useState<{ title: string; description: string } | null>(null);

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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!description.trim()) e.description = 'Description is required';
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Enter a valid amount';
    if (!categoryId) e.category = 'Select a category';
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
      setDialog({ title: 'Error', description: 'Could not save transaction.' });
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
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>{id ? 'Edit Transaction' : 'New Transaction'}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{ backgroundColor: accentColor, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, opacity: saving ? 0.6 : 1 }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        {/* Type toggle */}
        <View style={{ flexDirection: 'row', backgroundColor: tabBg, borderRadius: 14, padding: 4, marginBottom: 24 }}>
          {(['EXPENSE', 'INCOME'] as TxType[]).map((t) => {
            const isActive = type === t;
            const color = t === 'INCOME' ? violetColor : primaryColor;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => { setType(t); setCategoryId(null); }}
                style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11, backgroundColor: isActive ? color : 'transparent' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: isActive ? 'white' : mutedColor }}>
                  {t === 'INCOME' ? 'Income' : 'Expense'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FormInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Grocery shopping"
          error={errors.description}
        />

        <FormInput
          label="Amount (XAF)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0"
          keyboardType="numeric"
          error={errors.amount}
        />

        <DatePickerButton
          label="Date"
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
          label="Payment method"
          options={PAYMENT_OPTIONS}
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
