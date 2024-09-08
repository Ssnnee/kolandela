import '../global.css';
import { Slot, Stack } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

export default function RootLayout() {

  return (
    <Slot  />
  );
}
