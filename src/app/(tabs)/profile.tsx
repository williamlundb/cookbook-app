import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Card, Copy, Heading, Page, colors, s } from '../../ui';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  return <Page>
    <Copy style={s.eyebrow}>{t('profile')}</Copy>
    <Heading>{t('settings')}</Heading>

    <Card style={{ backgroundColor: colors.deepGreen, borderColor: colors.deepGreen, padding: 22 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ height: 54, width: 54, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }}><Copy style={{ color: '#E8C99E', fontSize: 25 }}>♧</Copy></View>
        <View style={{ flex: 1, gap: 4 }}><Copy style={{ color: colors.white, fontFamily: 'serif', fontSize: 22 }}>{t('guestTitle')}</Copy><Copy style={{ color: '#D6E1D7', fontSize: 14, lineHeight: 20 }}>{t('guestBody')}</Copy></View>
      </View>
      <Button title={t('signIn')} onPress={() => router.push('/auth')} />
    </Card>

    <Card><Copy style={s.label}>{t('language')}</Copy><Copy style={{ color: colors.muted }}>{t('languageBody')}</Copy><View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><Button secondary={i18n.language !== 'sv'} title={t('swedish')} onPress={() => { void i18n.changeLanguage('sv'); }} /></View><View style={{ flex: 1 }}><Button secondary={i18n.language !== 'en'} title={t('english')} onPress={() => { void i18n.changeLanguage('en'); }} /></View></View></Card>

    <Card><Copy style={s.label}>{t('privacy')}</Copy><Copy style={{ color: colors.muted }}>{t('privacyBody')}</Copy></Card>
    <Card><Copy style={s.label}>{t('plan')}</Copy><Copy style={{ color: colors.muted }}>{t('planBody')}</Copy></Card>
    <Pressable accessibilityRole="button" accessibilityLabel={t('authPreview')} onPress={() => router.push('/auth')} style={{ paddingVertical: 5 }}><Copy style={{ color: colors.muted, fontSize: 13, textAlign: 'center' }}>{t('authPreview')}</Copy></Pressable>
  </Page>;
}
