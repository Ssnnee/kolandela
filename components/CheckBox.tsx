import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CheckBoxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function  Checkbox(
  { checked, onChange }: CheckBoxProps
) {

  return (
    <Pressable
      className={
        `h-6 w-6 rounded-full bg-transparent border-2 border-foreground
        ${checked && 'border-green'}
        `
      }
      onPress={() => onChange(!checked)}>
      {checked && <Ionicons name='checkmark' size={16} color='#00FAD9' className=''/>}
    </Pressable>
  );
}
