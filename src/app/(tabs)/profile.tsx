import { useTranslation } from 'react-i18next';
import { Button, Card, Copy, Heading, Page, s } from '../../ui';
export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  return <Page><Copy style={s.eyebrow}>{t('profile')}</Copy><Heading>{t('settings')}</Heading><Card><Copy style={s.label}>{t('language')}</Copy><Button secondary={i18n.language !== 'sv'} title={t('swedish')} onPress={() => { void i18n.changeLanguage('sv'); }} /><Button secondary={i18n.language !== 'en'} title={t('english')} onPress={() => { void i18n.changeLanguage('en'); }} /></Card><Card><Copy style={s.label}>{t('plan')}</Copy><Copy>{t('planBody')}</Copy></Card><Card><Copy style={s.label}>{t('privacy')}</Copy><Copy>{t('privacyBody')}</Copy></Card><Card><Copy style={s.label}>{t('pending')}</Copy><Copy>{t('pendingBody')}</Copy></Card></Page>;
}
