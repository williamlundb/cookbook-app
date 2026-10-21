import { Pressable, ScrollView, StyleSheet, Text, View, type TextProps, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

export const colors = { paper: '#FAF7F0', ink: '#273D32', muted: '#53665A', green: '#315B43', line: '#DEDCCF', pale: '#EBEDE2', white: '#FFFFFF', clay: '#8D452D' };
export function Copy({ style, ...props }: TextProps) { return <Text {...props} style={[s.copy, style]} />; }
export function Heading({ children }: { children: ReactNode }) { return <Text accessibilityRole="header" style={s.heading}>{children}</Text>; }
export function Page({ children }: { children: ReactNode }) { return <SafeAreaView edges={['left', 'right', 'top']} style={s.page}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>{children}</ScrollView></SafeAreaView>; }
export function Card(props: ViewProps) { return <View {...props} style={[s.card, props.style]} />; }
export function Button({ title, onPress, secondary = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 }]}><Text style={[s.buttonText, secondary && { color: colors.green }]}>{title}</Text></Pressable>;
}
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper }, content: { padding: 24, gap: 18, paddingBottom: 40 },
  copy: { fontSize: 17, lineHeight: 26, color: colors.ink }, heading: { fontFamily: 'serif', fontSize: 36, lineHeight: 43, color: colors.ink },
  eyebrow: { color: colors.clay, fontSize: 13, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 20, gap: 12 },
  button: { backgroundColor: colors.green, minHeight: 52, paddingHorizontal: 20, paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: colors.pale }, buttonText: { color: colors.white, fontSize: 17, fontWeight: '600', textAlign: 'center' },
  input: { minHeight: 52, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 17, color: colors.ink },
  chip: { minHeight: 46, paddingHorizontal: 17, paddingVertical: 12, borderRadius: 24, backgroundColor: colors.pale, justifyContent: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, label: { fontSize: 16, fontWeight: '600', color: colors.ink },
});
