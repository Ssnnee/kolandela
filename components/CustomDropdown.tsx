import { Dropdown } from 'react-native-element-dropdown';
import { View, Text } from 'react-native';

interface CustomDropdownProps {
  label: string;
  data: Array<{ label: string, value: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  search?: boolean;
}

export function CustomDropdown(
  {
    label, data, value, onChange, search, error }: CustomDropdownProps
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
        search={search}
        searchPlaceholder={`Search ${label.toLowerCase()}`}
        inputSearchStyle={{ color: '#FFFFFF', borderRadius: 8 }}
        itemContainerStyle={ { borderRadius: 8 } }
        itemTextStyle={{ color: '#FFFFFF' }}
        activeColor="#666680"
        containerStyle={dropdownStyles}
      />
      {error && <Text className="text-red">{error}</Text>}
    </View>
  );
}

const dropdownStyles = {
  backgroundColor: '#26262F',
  borderWidth: 2,
  borderRadius: 8,
  padding: 10,
};

