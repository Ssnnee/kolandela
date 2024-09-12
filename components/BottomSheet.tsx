import { View } from 'react-native';
import { ReactNode } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';

type BottomSheetProps = {
  children?: ReactNode;
  bottomSheetRef: React.RefObject<any>;
  height?: number;
};

export default function  BottomSheet(
  { children, height, bottomSheetRef  }: BottomSheetProps
) {

  return (
    <RBSheet
      ref={bottomSheetRef}
      height={height ? height : 400}
      openDuration={250}
      closeOnPressMask={true}

    >
      <View className='bg-background p-5'>
        {children}
      </View>
    </RBSheet>
  );
}
