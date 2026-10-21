import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCookbook } from '../../state';
import { lines } from '../../domain/recipe';
import { Button, Card, Copy, Heading, Page, s } from '../../ui';
export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { recipes, remove } = useCookbook(); const { t } = useTranslation();
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return <Page><Copy>{t('missing')}</Copy><Button title={t('back')} onPress={() => router.replace('/')} /></Page>;
  return <Page><Button secondary title={t('back')} onPress={() => router.back()} /><Copy style={s.eyebrow}>{t(`categories.${recipe.category}`)}</Copy><Heading>{recipe.title}</Heading><Copy>{t('by', { name: recipe.author === 'demo' ? t('sampleName') : recipe.author })}</Copy>
    <Card>{recipe.servings !== '' && <Copy>{t('portions', { count: Number(recipe.servings) })}</Copy>}{(recipe.prepMinutes !== '' || recipe.cookMinutes !== '') && <Copy>{t('minutes', { count: Number(recipe.prepMinutes) + Number(recipe.cookMinutes) })}</Copy>}<Copy style={s.label}>{t('ingredients')}</Copy>{lines(recipe.ingredients).length ? lines(recipe.ingredients).map((line, i) => <Copy key={i}>{line}</Copy>) : <Copy>{t('noIngredients')}</Copy>}</Card>
    <Button title={t('cook')} disabled={!lines(recipe.steps).length} onPress={() => router.push({ pathname: '/cook/[id]', params: { id } })} />
    <Card><Copy style={s.label}>{t('steps')}</Copy>{lines(recipe.steps).length ? lines(recipe.steps).map((line, i) => <Copy key={i}>{i + 1}. {line}</Copy>) : <Copy>{t('noSteps')}</Copy>}</Card>
    {recipe.tips !== '' && <Card><Copy style={s.label}>{t('tips')}</Copy><Copy>{recipe.tips}</Copy></Card>}
    <Copy>{t('commentsPending')}</Copy><Button secondary title={t('edit')} onPress={() => router.push({ pathname: '/editor', params: { id } })} />
    <Button secondary title={t('delete')} onPress={() => Alert.alert(t('deleteTitle'), t('deleteBody'), [{ text: t('cancel'), style: 'cancel' }, { text: t('delete'), style: 'destructive', onPress: () => { remove(id); router.replace('/'); } }])} />
  </Page>;
}
