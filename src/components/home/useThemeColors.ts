import { useTheme } from '@/app/_context/ThemeContext';
import { useCurrencyContext } from '@/app/_context/CurrencyContext';

export function rgba(color: string, alpha: number) {
  return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
}

export function useCurrency() {
  const { currency, setCurrency } = useCurrencyContext();
  const format = (n: number) =>
    n.toLocaleString(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
    });
  return { format, currency, setCurrency };
}

export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return {
    isDark,
    cardBg: isDark ? 'rgb(26, 26, 34)' : 'rgb(255, 255, 255)',
    borderColor: isDark ? 'rgb(46, 46, 58)' : 'rgb(220, 220, 232)',
    textColor: isDark ? 'rgb(229, 229, 229)' : 'rgb(40, 40, 55)',
    mutedColor: 'rgb(131, 131, 156)',
    primaryColor: isDark ? 'rgb(255, 121, 102)' : 'rgb(255, 100, 80)',
    violetColor: isDark ? 'rgb(173, 123, 255)' : 'rgb(140, 90, 220)',
    greenColor: isDark ? 'rgb(0, 250, 217)' : 'rgb(0, 200, 175)',
    redColor: 'rgb(255, 59, 48)',
    tabBg: isDark ? 'rgb(38, 38, 47)' : 'rgb(235, 235, 242)',
  };
}
