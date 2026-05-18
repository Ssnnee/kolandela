import { View, Text } from 'react-native';
import { useTheme } from '../_context/ThemeContext';

export default function AddTransactionScreen() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgb(14,14,18)' : 'rgb(245,245,248)' }}>
      <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 18 }}>Add Transaction</Text>
    </View>
  );
}
