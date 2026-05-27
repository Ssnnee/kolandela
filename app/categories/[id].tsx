import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { DetailCard } from '@/components/DetailCard';
import * as categoryService from '@/services/categories';
import * as transactionService from '@/services/transactions';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useThemeColors, useCurrency } from '@/components/home/useThemeColors';

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cardBg, borderColor, textColor, mutedColor, primaryColor, violetColor, redColor, isDark } = useThemeColors();
  const { format } = useCurrency();
  const insets = useSafeAreaInsets();

  const { data: categoryList } = useLiveQuery(
    categoryService.getById(id ?? '')
  );
  const category = categoryList?.[0];

  const { data: txList } = useLiveQuery(
    transactionService.getByCategory(id ?? '')
  );

  if (!category) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: textColor }}>Loading category details…</Text>
      </View>
    );
  }

  const isIncome = category.type === 'INCOME';
  const totalAmount = (txList ?? []).reduce((sum, t) => sum + t.amount, 0);
  const txCount = txList?.length ?? 0;

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
        <Text style={{ flex: 1, color: textColor, fontSize: 18, fontWeight: '700' }}>Category Details</Text>
        <View style={{ width: 36 }} />
      </View>



      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>

        {/* Dynamic Theme Controlled Hero Block Card */}
        <View style={{ backgroundColor: category.color, borderRadius: 28, paddingVertical: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>{category.type}</Text>
          </View>

          {/* Sub Container Icon Square */}
          <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Ionicons name={(category.icon as any) || 'grid-sharp'} size={32} color="#FFF" />
          </View>

          <Text style={{ color: '#FFF', fontSize: 32, fontWeight: '600', letterSpacing: -0.5 }}>
            {category.name}
          </Text>

          {category.isDefault && (
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginTop: 8, fontWeight: '400' }}>
              Default category
            </Text>
          )}
        </View>

        {/* Aggregate Totals Info Block Container */}
        <DetailCard.Container style={{ marginBottom: 24 }}>
          <DetailCard.Row
            icon={<Ionicons name={isIncome ? "trending-up-sharp" : "trending-down-sharp"} size={20} color={isIncome ? violetColor : primaryColor} />}
            iconBg={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'}
          >
            <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>{isIncome ? 'Total earned' : 'Total spent'}</Text>
            <Text style={{ color: isIncome ? violetColor : primaryColor, fontSize: 18, fontWeight: '600' }}>
              {isIncome ? '+' : '-'}{format(totalAmount)}
            </Text>
          </DetailCard.Row>

          <DetailCard.Divider />

          <DetailCard.Row
            icon={<Ionicons name="list-sharp" size={20} color={textColor} />}
            iconBg={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'}
          >
            <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 2 }}>Transactions</Text>
            <Text style={{ color: textColor, fontSize: 18, fontWeight: '600' }}>{txCount}</Text>
          </DetailCard.Row>
        </DetailCard.Container>

        {/* Dynamic Nested Recent Transaction Sub-List Section */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12, marginLeft: 4 }}>
            Recent Transactions ({txCount})
          </Text>

          {txList && txList.length > 0 ? (
            <DetailCard.Container>
              {txList.map((tx, idx) => {
                const formattedTxDate = new Date(tx.transactionDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <View key={tx.id}>
                    <TouchableOpacity
                      onPress={() => router.push(`/transactions/${tx.id}`)}
                      activeOpacity={0.7}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>

                      {/* Left Dot Visual Anchor Block */}
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: category.color, marginRight: 14, marginLeft: 4 }} />

                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }} numberOfLines={1}>
                          {tx.description}
                        </Text>
                        <Text style={{ color: mutedColor, fontSize: 12, marginTop: 2 }}>
                          {formattedTxDate}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={{ color: tx.type === 'INCOME' ? violetColor : primaryColor, fontSize: 16, fontWeight: '600' }}>
                          {tx.type === 'INCOME' ? '+' : '-'}{format(tx.amount)}
                        </Text>
                        <Ionicons name="chevron-forward-sharp" size={16} color={mutedColor} />
                      </View>
                    </TouchableOpacity>
                    {idx < txList.length - 1 && (
                      <DetailCard.Divider />
                    )}
                  </View>
                );
              })}
            </DetailCard.Container>
          ) : (
            <View style={{ backgroundColor: cardBg, borderRadius: 24, borderWidth: 1, borderColor, padding: 32, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="receipt-sharp" size={28} color={mutedColor} style={{ marginBottom: 8 }} />
              <Text style={{ color: mutedColor, fontSize: 14 }}>No transactions recorded yet</Text>
            </View>
          )}
        </View>

        {/* Interactive Danger Zone Safeguard */}
        <DetailCard.Container>
          {category.isDefault ? (
            <View style={{ opacity: 0.5 }}>
              <DetailCard.Row
                icon={<Ionicons name="trash-sharp" size={20} color={textColor} />}
                iconBg={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
              >
                <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>
                  Cannot delete default category
                </Text>
              </DetailCard.Row>
            </View>
          ) : (
            <DetailCard.Row
              icon={<Ionicons name="trash-sharp" size={20} color={redColor} />}
              iconBg="rgba(255,59,48,0.1)"
              showChevron
              chevronColor={redColor}
            >
              <Text style={{ color: redColor, fontSize: 16, fontWeight: '600' }}>
                Delete category
              </Text>
            </DetailCard.Row>
          )}
        </DetailCard.Container>

      </ScrollView>
    </View>
  );
}
