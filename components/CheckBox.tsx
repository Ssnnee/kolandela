import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type MyCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  buttonStyle?: any;
  activeButtonStyle?: any;
  inactiveButtonStyle?: any;
  activeIconProps?: any;
  inactiveIconProps?: any;
};

export default function Checkbox({
  checked,
  onChange,
  buttonStyle,
  activeButtonStyle,
  inactiveButtonStyle,
  activeIconProps,
  inactiveIconProps,
}: MyCheckboxProps) {
  const iconProps = checked ? activeIconProps : inactiveIconProps;
  return (
    <Pressable
      style={[
        buttonStyle,
        checked
          ? activeButtonStyle
          : inactiveButtonStyle,
      ]}
      onPress={() => onChange(!checked)}>
      {checked && (
        <Ionicons
          name="checkmark"
          size={24}
          color="white"
          {...iconProps}
        />
      )}
    </Pressable>
  );
}


const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'coral',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: 'coral',
  },
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    marginVertical: 16,
    fontWeight: 'bold',
    fontSize: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 18,
  },
});

