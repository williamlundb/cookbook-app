import { useTranslation } from 'react-i18next';
import { Card, Copy, Heading, Page, s } from '../../ui';
export default function NotificationsScreen() { const { t } = useTranslation(); return <Page><Copy style={s.eyebrow}>{t('notifications')}</Copy><Heading>{t('notificationsTitle')}</Heading><Card><Copy>{t('notificationsBody')}</Copy></Card></Page>; }
