import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/home/useThemeColors';
import { useTranslation } from '@/app/_context/LanguageContext';

export default function NotFound() {
  const { textColor, mutedColor, primaryColor, cardBg, borderColor, isDark } = useThemeColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
      }}>
      <Text
        style={{
          fontSize: 96,
          fontWeight: '900',
          letterSpacing: -6,
          color: isDark ? 'rgb(46,46,58)' : 'rgb(220,220,232)',
          lineHeight: 96,
          marginBottom: 24,
        }}>
        404
      </Text>
      <Text
        style={{
          color: textColor,
          fontSize: 20,
          fontWeight: '700',
          letterSpacing: -0.5,
          marginBottom: 8,
          textAlign: 'center',
        }}>
        {t('screens.notFound.title')}
      </Text>
      <Text
        style={{
          color: mutedColor,
          fontSize: 14,
          textAlign: 'center',
          lineHeight: 21,
          marginBottom: 8,
        }}>
        {t('screens.notFound.description')}
      </Text>
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 100,
          borderWidth: 1,
          borderColor,
          paddingHorizontal: 14,
          paddingVertical: 6,
          marginBottom: 36,
        }}>
        <Text
          style={{ color: mutedColor, fontSize: 12, fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }) }}
          numberOfLines={1}>
          {pathname}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.replace('/')}
        activeOpacity={0.8}
        style={{
          backgroundColor: primaryColor,
          borderRadius: 14,
          paddingHorizontal: 28,
          paddingVertical: 14,
          shadowColor: primaryColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 8,
        }}>
        <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>{t('screens.notFound.goHome')}</Text>
      </TouchableOpacity>
    </View>
  );
}
