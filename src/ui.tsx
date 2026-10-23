import { Pressable, ScrollView, StyleSheet, Text, View, type TextProps, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

export const colors = { paper: '#F7F6F1', ink: '#26382F', muted: '#66756C', green: '#315B43', deepGreen: '#234631', line: '#E6E8E1', pale: '#EAF0E8', white: '#FFFFFF', clay: '#A45D3E', gold: '#D3A568', blush: '#F4EAE2' };
export function Copy({ style, ...props }: TextProps) { return <Text {...props} style={[s.copy, style]} />; }
export function Heading({ children }: { children: ReactNode }) { return <Text accessibilityRole="header" style={s.heading}>{children}</Text>; }
export function Page({ children }: { children: ReactNode }) { return <SafeAreaView edges={['left', 'right', 'top']} style={s.page}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>{children}</ScrollView></SafeAreaView>; }
export function Card(props: ViewProps) { return <View {...props} style={[s.card, props.style]} />; }
export function Button({ title, onPress, secondary = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 }]}><Text style={[s.buttonText, secondary && { color: colors.green }]}>{title}</Text></Pressable>;
}
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper }, content: { paddingHorizontal: 20, paddingTop: 18, gap: 18, paddingBottom: 44 },
  copy: { fontSize: 16, lineHeight: 24, color: colors.ink }, heading: { fontFamily: 'serif', fontSize: 34, lineHeight: 41, color: colors.ink, letterSpacing: -0.5 },
  eyebrow: { color: colors.clay, fontSize: 12, fontWeight: '700', letterSpacing: 1.25, textTransform: 'uppercase' },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 20, padding: 18, gap: 12, shadowColor: '#26382F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.045, shadowRadius: 12, elevation: 2 },
  button: { backgroundColor: colors.green, minHeight: 54, paddingHorizontal: 20, paddingVertical: 15, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: colors.pale }, buttonText: { color: colors.white, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  input: { minHeight: 54, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: colors.ink },
  chip: { minHeight: 42, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, justifyContent: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, label: { fontSize: 15, fontWeight: '700', color: colors.ink },
});
