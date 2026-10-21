import { useTranslation } from 'react-i18next';
import { Card, Copy, Heading, Page, s } from '../../ui';
export default function FollowingScreen() { const { t } = useTranslation(); return <Page><Copy style={s.eyebrow}>{t('following')}</Copy><Heading>{t('followingTitle')}</Heading><Card><Copy>{t('followingBody')}</Copy></Card></Page>; }
