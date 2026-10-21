import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import { useTranslation } from 'react-i18next';
import { useCookbook } from '../../state';
import { lines } from '../../domain/recipe';
import { Button, Card, Copy, Heading, Page, s } from '../../ui';
export default function CookingScreen() {
  useKeepAwake(); const { id } = useLocalSearchParams<{ id: string }>(); const { recipes } = useCookbook(); const { t } = useTranslation(); const [index, setIndex] = useState(0);
  const recipe = recipes.find(r => r.id === id); const steps = lines(recipe?.steps ?? '');
  return <Page><Button secondary title={t('back')} onPress={() => router.back()} /><Heading>{recipe?.title ?? t('missing')}</Heading><Copy style={s.eyebrow}>{steps.length ? t('step', { current: index + 1, total: steps.length }) : t('noSteps')}</Copy><Card><Copy accessibilityLiveRegion="polite" style={{ fontSize: 30, lineHeight: 44 }}>{steps[index] ?? t('noSteps')}</Copy></Card><Button secondary disabled={index === 0} title={t('previous')} onPress={() => setIndex(i => i - 1)} /><Button title={index + 1 >= steps.length ? t('finish') : t('next')} onPress={() => index + 1 >= steps.length ? router.back() : setIndex(i => i + 1)} /></Page>;
}
