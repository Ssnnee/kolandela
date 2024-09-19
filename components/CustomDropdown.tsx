import { Dropdown } from 'react-native-element-dropdown';
import { View, Text } from 'react-native';

interface CustomDropdownProps {
  label: string;
  data: Array<{ label: string, value: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CustomDropdown(
  {
    label, data, value, onChange, error }: CustomDropdownProps
) {
  return (
    <View className="mb-5">
      <Text className="text-white mb-1">{label}</Text>
      <Dropdown
        data={data}
        value={value}
        onChange={(item) => onChange(item.value)}
        labelField="label"
        valueField="value"
        style={dropdownStyles}
        placeholderStyle={{ color: '#666680' }}
        selectedTextStyle={{ color: '#FFFFFF' }}
        search
        searchPlaceholder={`Search ${label.toLowerCase()}`}
        inputSearchStyle={{ color: '#FFFFFF' }}
        itemTextStyle={{ color: '#FFFFFF' }}
        activeColor="#FF7966"
        containerStyle={dropdownStyles}
      />
      {error && <Text className="text-orange">{error}</Text>}
    </View>
  );
}

const dropdownStyles = {
  backgroundColor: '#26262F',
  borderColor: '#666680',
  borderWidth: 2,
  borderRadius: 10,
  padding: 10,
};

