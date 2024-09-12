import { useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function  Checkbox() {
  const [checked, setChecked] = useState(false);

  return (
    <Pressable
      className={
        `h-6 w-6 rounded-full bg-transparent border-2 border-foreground ${checked && 'border-green'}`
      }
      onPress={() => setChecked(!checked)}>
      {checked && <Ionicons name='checkmark' size={15} color='#00FAD9' className='left-1'/>}
    </Pressable>
  );
}
