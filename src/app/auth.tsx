import { useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Copy, Heading, Page, colors, s } from '../ui';

export default function AuthScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const showSetupNotice = () => Alert.alert(t('authNotLive'), t('authNotLiveBody'));
  const sendLink = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert(t('emailInvalidTitle'), t('emailInvalidBody'));
      return;
    }
    showSetupNotice();
  };

  return <Page>
    <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => router.back()} style={{ alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 18 }}><Copy style={{ color: colors.green, fontWeight: '700' }}>‹  {t('back')}</Copy></Pressable>

    <View style={{ alignItems: 'center', gap: 11, paddingTop: 20, paddingBottom: 6 }}>
      <View style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' }}><Copy style={{ fontSize: 34, color: colors.green }}>♧</Copy></View>
      <Copy style={s.eyebrow}>{t('authEyebrow')}</Copy>
      <Heading>{t('authHeading')}</Heading>
      <Copy style={{ color: colors.muted, textAlign: 'center', maxWidth: 330 }}>{t('authDescription')}</Copy>
    </View>

    <View style={{ gap: 11, marginTop: 12 }}>
      <Pressable accessibilityRole="button" onPress={showSetupNotice} style={({ pressed }) => ({ minHeight: 54, borderRadius: 15, paddingHorizontal: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, opacity: pressed ? 0.7 : 1 })}><Copy style={{ fontSize: 18, color: colors.ink }}>●</Copy><Copy style={{ fontWeight: '700' }}>{t('continueApple')}</Copy></Pressable>
      <Pressable accessibilityRole="button" onPress={showSetupNotice} style={({ pressed }) => ({ minHeight: 54, borderRadius: 15, paddingHorizontal: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, opacity: pressed ? 0.7 : 1 })}><Copy style={{ fontSize: 18, color: '#4285F4', fontWeight: '700' }}>G</Copy><Copy style={{ fontWeight: '700' }}>{t('continueGoogle')}</Copy></Pressable>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 3 }}><View style={{ height: 1, flex: 1, backgroundColor: colors.line }} /><Copy style={{ color: colors.muted, fontSize: 13 }}>{t('orEmail')}</Copy><View style={{ height: 1, flex: 1, backgroundColor: colors.line }} /></View>

    <View style={{ gap: 10 }}>
      <Copy style={s.label}>{t('email')}</Copy>
      <TextInput accessibilityLabel={t('email')} autoCapitalize="none" autoComplete="email" autoCorrect={false} keyboardType="email-address" placeholder={t('emailPlaceholder')} placeholderTextColor={colors.muted} returnKeyType="go" onSubmitEditing={sendLink} value={email} onChangeText={setEmail} style={s.input} />
      <Button title={t('emailLink')} onPress={sendLink} />
      <Copy style={{ color: colors.muted, textAlign: 'center', fontSize: 14, lineHeight: 21 }}>{t('emailAccountHint')}</Copy>
    </View>

    <View style={{ backgroundColor: '#EDF0E8', borderRadius: 14, padding: 14, gap: 5 }}><Copy style={{ color: colors.green, fontWeight: '700', fontSize: 14 }}>{t('authPreviewTitle')}</Copy><Copy style={{ color: colors.muted, fontSize: 13, lineHeight: 19 }}>{t('authPreviewBody')}</Copy></View>
    <Copy style={{ color: colors.muted, fontSize: 12, textAlign: 'center', lineHeight: 18 }}>{t('authLegal')}</Copy>
  </Page>;
}
