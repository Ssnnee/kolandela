import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AlertDialog } from '@/components/AlertDialog';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as plannedTransactionService from '@/services/plannedTransactions';
import * as categoryService from '@/services/categories';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/components/home/useThemeColors';
import { FormInput, FormPicker, FormToggle, CategoryPicker, DatePickerButton } from '@/components/forms';

type TxType = 'INCOME' | 'EXPENSE';
type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

const FREQ_OPTIONS = [
  { label: 'Daily', value: 'DAILY' as Frequency },
  { label: 'Weekly', value: 'WEEKLY' as Frequency },
  { label: 'Monthly', value: 'MONTHLY' as Frequency },
  { label: 'Yearly', value: 'YEARLY' as Frequency },
];

export default function AddPlannedTransaction() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { textColor, mutedColor, primaryColor, violetColor, cardBg, borderColor, tabBg, isDark } = useThemeColors();
  const [dialog, setDialog] = useState<{ title: string; description: string } | null>(null);

  const { data: cats } = useLiveQuery(categoryService.getAll());
  const { data: plannedList } = useLiveQuery(
    plannedTransactionService.getById(id ?? '')
  );
  const editingPlanned = id ? plannedList?.[0] : null;

  const [type, setType] = useState<TxType>('EXPENSE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<Frequency>('MONTHLY');
  const [recurring, setRecurring] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [hasPrefilled, setHasPrefilled] = useState(false);

  useEffect(() => {
    if (editingPlanned && !hasPrefilled) {
      setType(editingPlanned.type);
      setDescription(editingPlanned.description);
      setAmount(editingPlanned.amount.toString());
      setCategoryId(editingPlanned.categoryId);
      setFrequency(editingPlanned.frequency);
      setRecurring(editingPlanned.recurring);
      setStartDate(new Date(editingPlanned.startDate));
      setHasPrefilled(true);
    }
  }, [editingPlanned, hasPrefilled]);

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
        await plannedTransactionService.update(id, {
          description: description.trim(),
          amount: Math.round(Number(amount)),
          type,
          categoryId: categoryId!,
          frequency,
          recurring,
          startDate,
          nextExecutionDate: startDate,
        });
      } else {
        await plannedTransactionService.create({
          description: description.trim(),
          amount: Math.round(Number(amount)),
          type,
          categoryId: categoryId!,
          frequency,
          recurring,
          startDate,
          nextExecutionDate: startDate,
          isActive: true,
        });
      }
      router.back();
    } catch (e) {
      setDialog({ title: 'Error', description: 'Could not save planned transaction.' });
    } finally {
      setSaving(false);
    }
  };

  const accentColor = type === 'INCOME' ? primaryColor : violetColor;

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: cardBg, borderWidth: 1, borderColor, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>{id ? 'Edit Planned' : 'New Planned'}</Text>
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
            const color = t === 'INCOME' ? primaryColor : violetColor;
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
          placeholder="e.g. Netflix subscription"
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
          label="Start date"
          date={startDate}
          onPress={() => {/* TODO: open date picker */ }}
        />

        <CategoryPicker
          categories={filteredCats}
          selected={categoryId}
          onSelect={setCategoryId}
          error={errors.category}
        />

        <FormPicker
          label="Frequency"
          options={FREQ_OPTIONS}
          selected={frequency}
          onSelect={setFrequency}
        />

        <FormToggle
          label="Recurring"
          sublabel="Automatically advance to next cycle after execution"
          value={recurring}
          onValueChange={setRecurring}
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
