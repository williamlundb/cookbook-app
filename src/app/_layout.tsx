import '../i18n';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CookbookProvider } from '../state';
import { colors } from '../ui';

export default function RootLayout() {
  return <SafeAreaProvider><CookbookProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}><Stack.Screen name="(tabs)" /><Stack.Screen name="editor" options={{ presentation: 'modal', gestureEnabled: false }} /></Stack></CookbookProvider></SafeAreaProvider>;
}
