import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { colors } from '../../ui';

export default function TabLayout() {
  const { t } = useTranslation();
  const tabs = [{ name: 'index', label: 'myBook', icon: '▤' }, { name: 'following', label: 'following', icon: '♡' }, { name: 'notifications', label: 'notifications', icon: '◉' }, { name: 'profile', label: 'profile', icon: '○' }];
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.green, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.paper }, tabBarItemStyle: { minHeight: 48 }, tabBarLabelStyle: { fontSize: 11 } }}>{tabs.map(tab => <Tabs.Screen key={tab.name} name={tab.name} options={{ title: t(tab.label), tabBarAccessibilityLabel: t(tab.label), tabBarIcon: ({ color }) => <Text accessible={false} style={{ color, fontSize: 27 }}>{tab.icon}</Text> }} />)}</Tabs>;
}
