import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors, rgba } from '@/components/home/useThemeColors';
import type { Category } from '@/db/schema';

interface CategoryPickerProps {
  label?: string;
  categories: Category[];
  selected: string | null;
  onSelect: (id: string) => void;
  error?: string;
}

export function CategoryPicker({ label = 'Category', categories, selected, onSelect, error }: CategoryPickerProps) {
  const { textColor, mutedColor, borderColor } = useThemeColors();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {categories.map((cat) => {
          const isSelected = cat.id === selected;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: isSelected ? rgba(cat.color, 0.12) : 'transparent',
                borderWidth: 1,
                borderColor: isSelected ? cat.color : borderColor,
              }}>
              <View style={{ width: 24, height: 24, borderRadius: 7, backgroundColor: rgba(cat.color, 0.15), alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={(cat.icon as any) || 'grid-outline'} size={13} color={cat.color} />
              </View>
              <Text style={{ color: isSelected ? cat.color : textColor, fontSize: 13, fontWeight: isSelected ? '600' : '400' }}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {error && (
        <Text style={{ color: 'rgb(255,59,48)', fontSize: 12, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
}
