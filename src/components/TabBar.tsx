import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/app/_context/ThemeContext';
import { useBottomSheet } from '@/app/_context/BottomSheetContext';
import { useTranslation } from '@/app/_context/LanguageContext';

const TAB_ICONS: Record<string,
  {
    active: keyof typeof Ionicons.glyphMap;
    inactive: keyof typeof Ionicons.glyphMap
  }> = {
  index: { active: 'home', inactive: 'home-outline' },
  categories: { active: 'grid', inactive: 'grid-outline' },
  stats: { active: 'pie-chart', inactive: 'pie-chart-outline' },
  settings: { active: 'settings', inactive: 'settings-outline' },
};

const LEFT_ROUTES = ['index', 'categories'];
const RIGHT_ROUTES = ['stats', 'settings'];

function tabLabel(routeName: string, t: (path: string) => string): string {
  const map: Record<string, string> = {
    index: t('tabs.home.title'),
    categories: t('tabs.categories.title'),
    stats: t('tabs.stats.title'),
    settings: t('tabs.settings.title'),
  };
  return map[routeName] ?? routeName;
}

const TAB_CONTENT_HEIGHT = 56; // px of visible tab content above inset

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { resolvedTheme } = useTheme();
  const { openBottomSheet } = useBottomSheet();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const isDark = resolvedTheme === 'dark';
  const primaryColor = isDark ? 'rgb(255, 121, 102)' : 'rgb(255, 100, 80)';
  const mutedColor = 'rgb(131, 131, 156)';

  const renderTab = (routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return null;
    const isFocused = state.routes[state.index]?.name === routeName;
    return (
      <TouchableOpacity
        key={route.key}
        onPress={() => navigation.navigate(routeName)}
        className="flex-1 items-center gap-1 py-1">
        <Ionicons
          name={isFocused ? TAB_ICONS[routeName].active : TAB_ICONS[routeName].inactive}
          size={24}
          color={isFocused ? primaryColor : mutedColor}
        />
        <Text className={`text-xs ${isFocused ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          {tabLabel(routeName, t)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        height: TAB_CONTENT_HEIGHT + insets.bottom,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: isDark ? 'rgb(14, 14, 18)' : 'rgb(245, 245, 248)',
        borderTopWidth: 1,
        borderTopColor: isDark ? 'rgb(46, 46, 58)' : 'rgb(220, 220, 232)',
      }}>
      <View
        style={{ paddingBottom: insets.bottom }}
        className="flex-1 flex-row items-center justify-around px-2 pt-2">
        {LEFT_ROUTES.map(renderTab)}
        <TouchableOpacity
          onPress={openBottomSheet}
          activeOpacity={0.7}
          className="flex-1 flex-col items-center justify-center gap-1" // Added flex-col and justify-center
          accessibilityLabel="Add new"
          accessibilityRole="button">
          <View className="bg-primary/10 border-primary/25 h-9 w-9 items-center justify-center rounded-full border">
            {/* Centered perfectly inside the circle */}
            <Ionicons
              name="add"
              size={22}
              color={primaryColor}
              style={{ transform: [{ translateY: 0.5 }] }} // Optional: Nudge slightly if font metrics skew it
            />
          </View>
          <Text className="text-primary text-xs font-medium include-font-padding-false textAlignVertical-center">
            {t('global.actions.add')}
          </Text>
        </TouchableOpacity>
        {RIGHT_ROUTES.map(renderTab)}
      </View>
    </View>
  );
}
