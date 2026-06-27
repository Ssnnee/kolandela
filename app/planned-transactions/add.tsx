import { View, Text, ScrollView, TouchableOpacity, Animated, LayoutAnimation } from 'react-native';
import { AlertDialog } from '@/components/AlertDialog';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as plannedTransactionService from '@/services/plannedTransactions';
import * as categoryService from '@/services/categories';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, useCurrency } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';
import { FormInput, FormPicker, FormToggle, CategoryPicker, DatePickerButton } from '@/components/forms';
import { SwipeDetector } from '@/components/SwipeDetector';

type TxType = 'INCOME' | 'EXPENSE';
type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export default function AddPlannedTransaction() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const insets = useSafeAreaInsets();
  const { textColor, mutedColor, primaryColor, violetColor, cardBg, borderColor, tabBg, isDark } = useThemeColors();
  const { currency } = useCurrency();
  const { t } = useTranslation();
  const [dialog, setDialog] = useState<{ title: string; description: string } | null>(null);

  const formatAmount = (val: string) => val ? val.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';
  const handleAmountChange = (text: string) => setAmount(text.replace(/\s/g, ''));

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

  const freqOptions = useMemo(() => [
    { label: t('global.frequencies.DAILY'), value: 'DAILY' as Frequency },
    { label: t('global.frequencies.WEEKLY'), value: 'WEEKLY' as Frequency },
    { label: t('global.frequencies.MONTHLY'), value: 'MONTHLY' as Frequency },
    { label: t('global.frequencies.YEARLY'), value: 'YEARLY' as Frequency },
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
    } catch {
      setDialog({ title: t('global.dialogs.error'), description: t('global.errors.couldNotSavePlanned') });
    } finally {
      setSaving(false);
    }
  };

  const accentColor = type === 'INCOME' ? violetColor : primaryColor;

  const [containerWidth, setContainerWidth] = useState(0);
  const tabWidth = (containerWidth - 8) / 2;
  const animatedValue = useRef(new Animated.Value(type === 'INCOME' ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: type === 'INCOME' ? 1 : 0,
      useNativeDriver: true,
      tension: 140,
      friction: 14,
    }).start();
  }, [type, animatedValue]);

  const changeType = (newType: TxType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setType(newType);
    setCategoryId(null);
  };

  const handleSwipeLeft = () => {
    if (type === 'EXPENSE') {
      changeType('INCOME');
    }
  };

  const handleSwipeRight = () => {
    if (type === 'INCOME') {
      changeType('EXPENSE');
    }
  };

  return (
    <SwipeDetector onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight}>
      <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: cardBg, borderWidth: 1, borderColor, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>{id ? t('screens.plannedTransactions.edit') : t('screens.plannedTransactions.new')}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{ backgroundColor: accentColor, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, opacity: saving ? 0.6 : 1 }}>
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>{t('global.actions.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        {/* Type toggle */}
        <View 
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          style={{ flexDirection: 'row', backgroundColor: tabBg, borderRadius: 14, padding: 4, marginBottom: 24, position: 'relative' }}
        >
          {containerWidth > 0 && (
            <>
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 4,
                  bottom: 4,
                  left: 4,
                  width: tabWidth,
                  borderRadius: 11,
                  backgroundColor: primaryColor,
                  opacity: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                  transform: [{
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, tabWidth]
                    })
                  }]
                }}
              />
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 4,
                  bottom: 4,
                  left: 4,
                  width: tabWidth,
                  borderRadius: 11,
                  backgroundColor: violetColor,
                  opacity: animatedValue,
                  transform: [{
                    translateX: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, tabWidth]
                    })
                  }]
                }}
              />
            </>
          )}
          {(['EXPENSE', 'INCOME'] as TxType[]).map((mode) => {
            const isActive = type === mode;
            return (
              <TouchableOpacity
                key={mode}
                onPress={() => changeType(mode)}
                style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 11, backgroundColor: 'transparent' }}>
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
          placeholder={t('global.placeholders.plannedDescription')}
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
          label={t('screens.plannedTransactions.startDate')}
          date={startDate}
          onChange={setStartDate}
          allowPast={false}
        />

        <CategoryPicker
          categories={filteredCats}
          selected={categoryId}
          onSelect={setCategoryId}
          error={errors.category}
        />

        {recurring && (
          <FormPicker
            label={t('screens.plannedTransactions.frequency')}
            options={freqOptions}
            selected={frequency}
            onSelect={setFrequency}
          />
        )}

        <FormToggle
          label={t('screens.plannedTransactions.recurring')}
          sublabel={t('screens.plannedTransactions.recurringSublabel')}
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
    </SwipeDetector>
  );
}
