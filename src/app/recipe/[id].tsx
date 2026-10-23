import { Alert, Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCookbook } from '../../state';
import { lines } from '../../domain/recipe';
import { Button, Card, Copy, Heading, Page, colors, s } from '../../ui';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { recipes, remove } = useCookbook();
  const { t } = useTranslation();
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return <Page><Copy>{t('missing')}</Copy><Button title={t('back')} onPress={() => router.replace('/')} /></Page>;
  const ingredients = lines(recipe.ingredients);
  const steps = lines(recipe.steps);
  const totalMinutes = Number(recipe.prepMinutes || 0) + Number(recipe.cookMinutes || 0);
  const confirmDelete = () => Alert.alert(t('deleteTitle'), t('deleteBody'), [{ text: t('cancel'), style: 'cancel' }, { text: t('delete'), style: 'destructive', onPress: () => { remove(id); router.replace('/'); } }]);

  return <Page>
    <Pressable accessibilityRole="button" accessibilityLabel={t('back')} onPress={() => router.back()} style={{ alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 16 }}><Copy style={{ color: colors.green, fontWeight: '700' }}>‹  {t('back')}</Copy></Pressable>
    <View style={{ borderRadius: 24, padding: 24, minHeight: 184, justifyContent: 'space-between', backgroundColor: '#E7ECE3' }}>
      <Copy style={s.eyebrow}>{t(`categories.${recipe.category}`)}</Copy>
      <View style={{ gap: 8 }}><Heading>{recipe.title}</Heading><Copy style={{ color: colors.muted }}>{t('by', { name: recipe.author === 'demo' ? t('sampleName') : recipe.author })}</Copy></View>
    </View>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
      {recipe.servings !== '' && <View style={{ borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: colors.pale }}><Copy style={{ fontSize: 14, fontWeight: '600' }}>♧  {t('portions', { count: Number(recipe.servings) })}</Copy></View>}
      {totalMinutes > 0 && <View style={{ borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: colors.pale }}><Copy style={{ fontSize: 14, fontWeight: '600' }}>◷  {t('minutes', { count: totalMinutes })}</Copy></View>}
    </View>
    <Button title={t('cook')} disabled={!steps.length} onPress={() => router.push({ pathname: '/cook/[id]', params: { id } })} />
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}><Copy style={{ fontFamily: 'serif', fontSize: 24, color: colors.ink }}>{t('ingredients')}</Copy><Copy style={{ fontSize: 13, color: colors.muted }}>{ingredients.length}</Copy></View>
      {ingredients.length ? ingredients.map((item, i) => <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 7, borderBottomWidth: i < ingredients.length - 1 ? 1 : 0, borderBottomColor: colors.line }}><Copy style={{ color: colors.clay, fontSize: 16 }}>•</Copy><Copy style={{ flex: 1 }}>{item}</Copy></View>) : <Copy style={{ color: colors.muted }}>{t('noIngredients')}</Copy>}
    </Card>
    <Card>
      <Copy style={{ fontFamily: 'serif', fontSize: 24, color: colors.ink }}>{t('steps')}</Copy>
      {steps.length ? steps.map((step, i) => <View key={i} style={{ flexDirection: 'row', gap: 13, alignItems: 'flex-start', paddingVertical: 8 }}><View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' }}><Copy style={{ color: colors.green, fontWeight: '700', fontSize: 13 }}>{i + 1}</Copy></View><Copy style={{ flex: 1, paddingTop: 2 }}>{step}</Copy></View>) : <Copy style={{ color: colors.muted }}>{t('noSteps')}</Copy>}
    </Card>
    {recipe.tips !== '' && <Card style={{ backgroundColor: '#F4EAE2', borderColor: '#EEDDD1' }}><Copy style={s.eyebrow}>{t('tips')}</Copy><Copy>{recipe.tips}</Copy></Card>}
    <Copy style={{ color: colors.muted, fontSize: 14 }}>{t('commentsPending')}</Copy>
    <View style={{ flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><Button secondary title={t('edit')} onPress={() => router.push({ pathname: '/editor', params: { id } })} /></View><Pressable accessibilityRole="button" accessibilityLabel={t('delete')} onPress={confirmDelete} style={({ pressed }) => ({ minHeight: 54, paddingHorizontal: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E4CFC6', opacity: pressed ? 0.65 : 1 })}><Copy style={{ color: colors.clay, fontWeight: '700' }}>⌫</Copy></Pressable></View>
  </Page>;
}
