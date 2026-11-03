import { useEffect } from 'react';
import {
  View,
  ScrollView,
  Animated,
  useAnimatedValue
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/src/components/home/useThemeColors';
import { DetailCard } from '@/src/components/DetailCard';

const SkeletonBlock = ({
  width,
  height,
  borderRadius = 8,
  marginBottom = 0,
  style = {},
  isDark,
  pulseAnim,
}: any) => (
  <Animated.View
    style={[
      {
        width,
        height,
        borderRadius,
        marginBottom,
        backgroundColor: isDark ? 'rgb(28, 28, 35)' : 'rgb(228, 228, 235)',
        opacity: pulseAnim,
      },
      style,
    ]}
  />
);

export function TransactionDetailSkeleton() {
  const { isDark, borderColor } = useThemeColors();
  const insets = useSafeAreaInsets();

  const pulseAnim = useAnimatedValue(0.4);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Helper bindings
  const renderBlock = (props: any) => (
    <SkeletonBlock isDark={isDark} pulseAnim={pulseAnim} {...props} />
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', paddingTop: insets.top }}>

      {/* Header Bar Placeholder */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 }}>
        {renderBlock({ width: 36, height: 36, borderRadius: 12 })}
        {renderBlock({ width: "45%", height: 22, borderRadius: 6, style: { flex: 1 } })}
        {renderBlock({ width: 36, height: 36, borderRadius: 12 })}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>

        {/* Top Hero Card Box Placeholder */}
        <View style={{ backgroundColor: isDark ? 'rgb(22, 22, 29)' : 'rgb(238, 238, 243)', borderRadius: 28, paddingVertical: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          {/* Badge */}
          {renderBlock({ width: 60, height: 20, borderRadius: 10, marginBottom: 16 })}
          {/* Amount price indicator */}
          {renderBlock({ width: "60%", height: 48, borderRadius: 12, marginBottom: 16 })}
          {/* Date */}
          {renderBlock({ width: "40%", height: 16, borderRadius: 6, marginBottom: 6 })}
          {/* Time */}
          {renderBlock({ width: "20%", height: 14, borderRadius: 6 })}
        </View>

        {/* Main Parameters Block Placeholder */}
        <DetailCard.Container style={{ marginBottom: 16 }}>
          {/* Row 1: Description */}
          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 }}>
            {renderBlock({ width: 36, height: 36, borderRadius: 18 })}
            <View style={{ flex: 1, gap: 6 }}>
              {renderBlock({ width: "30%", height: 12, borderRadius: 4 })}
              {renderBlock({ width: "75%", height: 16, borderRadius: 6 })}
            </View>
          </View>
          <DetailCard.Divider />

          {/* Row 2: Category */}
          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 }}>
            {renderBlock({ width: 36, height: 36, borderRadius: 18 })}
            <View style={{ flex: 1, gap: 6 }}>
              {renderBlock({ width: "25%", height: 12, borderRadius: 4 })}
              {renderBlock({ width: "50%", height: 16, borderRadius: 6 })}
            </View>
          </View>
          <DetailCard.Divider />

          {/* Row 3: Payment Method */}
          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 }}>
            {renderBlock({ width: 36, height: 36, borderRadius: 18 })}
            <View style={{ flex: 1, gap: 6 }}>
              {renderBlock({ width: "35%", height: 12, borderRadius: 4 })}
              {renderBlock({ width: "40%", height: 16, borderRadius: 6 })}
            </View>
          </View>
        </DetailCard.Container>

        {/* Planned Transaction Conditional Block Placeholder */}
        <DetailCard.Container style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 }}>
            {renderBlock({ width: 36, height: 36, borderRadius: 18 })}
            <View style={{ flex: 1, gap: 6 }}>
              {renderBlock({ width: "40%", height: 12, borderRadius: 4 })}
              {renderBlock({ width: "65%", height: 16, borderRadius: 6 })}
            </View>
          </View>
        </DetailCard.Container>

        {/* Delete Button Placeholder */}
        <DetailCard.Container style={{ borderColor: isDark ? 'rgba(255,59,48,0.15)' : borderColor }}>
          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 }}>
            {renderBlock({ width: 36, height: 36, borderRadius: 18 })}
            {renderBlock({ width: "50%", height: 16, borderRadius: 6 })}
          </View>
        </DetailCard.Container>

      </ScrollView>
    </View>
  );
}
