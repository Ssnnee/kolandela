import React, { useEffect, useRef } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/home/useThemeColors';
import { DetailCard } from '@/components/DetailCard';

export function CategoryDetailSkeleton() {
  const { isDark, borderColor } = useThemeColors();
  const insets = useSafeAreaInsets();

  // Shimmer pulse loop initialization
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

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

  // Structural skeleton atom element
  const SkeletonBlock = ({ width, height, borderRadius = 8, marginBottom = 0, style = {} }: any) => (
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

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)', paddingTop: insets.top }}>

      {/* Header Bar Layout Placeholder */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 }}>
        <SkeletonBlock width={36} height={36} borderRadius={12} />
        <SkeletonBlock width="50%" height={22} borderRadius={6} style={{ flex: 1 }} />
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 + insets.bottom }} showsVerticalScrollIndicator={false}>

        {/* Top Hero Container Block Placeholder */}
        <View style={{ backgroundColor: isDark ? 'rgb(22, 22, 29)' : 'rgb(238, 238, 243)', borderRadius: 28, paddingVertical: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          {/* Badge indicator */}
          <SkeletonBlock width={64} height={20} borderRadius={10} marginBottom={16} />
          {/* Main Square Icon wrapper block */}
          <SkeletonBlock width={64} height={64} borderRadius={20} marginBottom={14} />
          {/* Category Title String wrapper */}
          <SkeletonBlock width="45%" height={32} borderRadius={8} />
        </View>

        {/* Aggregate Totals Container Block Placeholder */}
        <DetailCard.Container style={{ marginBottom: 24 }}>
          {/* Row 1: Earned/Spent Sum */}
          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 }}>
            <SkeletonBlock width={36} height={36} borderRadius={18} />
            <View style={{ flex: 1, gap: 6 }}>
              <SkeletonBlock width="35%" height={12} borderRadius={4} />
              <SkeletonBlock width="45%" height={18} borderRadius={6} />
            </View>
          </View>
          <DetailCard.Divider />

          {/* Row 2: Transactions Count */}
          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 }}>
            <SkeletonBlock width={36} height={36} borderRadius={18} />
            <View style={{ flex: 1, gap: 6 }}>
              <SkeletonBlock width="25%" height={12} borderRadius={4} />
              <SkeletonBlock width="15%" height={18} borderRadius={6} />
            </View>
          </View>
        </DetailCard.Container>

        {/* Dynamic Nested Recent Transaction Sub-List Section Placeholder */}
        <View style={{ marginBottom: 24 }}>
          <SkeletonBlock width="45%" height={14} borderRadius={4} marginBottom={12} style={{ marginLeft: 4 }} />

          <DetailCard.Container>
            {/* Displaying 3 template row list placeholders */}
            {[1, 2, 3].map((item, index) => (
              <View key={item}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12 }}>
                  {/* Left Dot Visual Anchor */}
                  <SkeletonBlock width={8} height={8} borderRadius={4} style={{ marginRight: 14 }} />

                  <View style={{ flex: 1, gap: 6, marginRight: 8 }}>
                    <SkeletonBlock width="70%" height={16} borderRadius={6} />
                    <SkeletonBlock width="40%" height={12} borderRadius={4} />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <SkeletonBlock width={55} height={16} borderRadius={6} />
                    <View style={{ width: 16 }} />
                  </View>
                </View>
                {index < 2 && <DetailCard.Divider />}
              </View>
            ))}
          </DetailCard.Container>
        </View>

        {/* Bottom Interactive Danger Zone Action Block Placeholder */}
        <DetailCard.Container style={{ borderColor: isDark ? 'rgba(255,59,48,0.15)' : borderColor }}>
          <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center', gap: 12 }}>
            <SkeletonBlock width={36} height={36} borderRadius={18} />
            <SkeletonBlock width="40%" height={16} borderRadius={6} />
          </View>
        </DetailCard.Container>

      </ScrollView>
    </View>
  );
}
