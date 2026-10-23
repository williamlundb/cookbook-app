import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCookbook } from '../../state';
import { categories, searchRecipes } from '../../domain/recipe';
import { Button, Card, Copy, Heading, Page, colors, s } from '../../ui';

const artColors = ['#EFE2D4', '#E5EBE1', '#F2E8D5', '#EAE4EF'];

export default function CookbookScreen() {
  const { t } = useTranslation();
  const { recipes } = useCookbook();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const visible = searchRecipes(recipes, query, category);
  const featured = !query && category === 'all' ? visible[0] : undefined;
  const list = featured ? visible.slice(1) : visible;

  return <Page>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flex: 1, gap: 7 }}>
        <Copy style={s.eyebrow}>{t('demo')}</Copy>
        <Heading>{t('bookName')}</Heading>
        <Copy style={{ color: colors.muted }}>{t('bookDescription')}</Copy>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={t('add')} onPress={() => router.push('/editor')} style={({ pressed }) => ({ width: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.green, opacity: pressed ? 0.8 : 1, marginLeft: 12 })}>
        <Copy style={{ color: colors.white, fontSize: 28, lineHeight: 32, fontWeight: '400' }}>+</Copy>
      </Pressable>
    </View>

    <View style={{ backgroundColor: '#EDF0E8', borderRadius: 14, padding: 13, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <Copy style={{ color: colors.green, fontSize: 18 }}>ⓘ</Copy>
      <Copy style={{ flex: 1, color: colors.muted, fontSize: 13, lineHeight: 19 }}>{t('demoNotice')}</Copy>
    </View>

    {featured && <Pressable accessibilityRole="button" accessibilityLabel={t('openRecipe', { title: featured.title })} onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: featured.id } })}>
      <View style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: colors.deepGreen, padding: 22, minHeight: 186, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Copy style={{ color: '#E8C99E', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 }}>{t('featured').toLocaleUpperCase()}</Copy>
          <View style={{ borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.13)' }}><Copy style={{ color: colors.white, fontSize: 12 }}>{t(`categories.${featured.category}`)}</Copy></View>
        </View>
        <View style={{ gap: 9, marginTop: 18 }}>
          <Copy style={{ color: colors.white, fontFamily: 'serif', fontSize: 30, lineHeight: 36 }}>{featured.title}</Copy>
          <Copy style={{ color: '#D6E1D7', fontSize: 14 }}>{featured.servings ? t('portions', { count: Number(featured.servings) }) : t('by', { name: featured.author === 'demo' ? t('sampleName') : featured.author })}  ·  {t('openArrow')}</Copy>
        </View>
      </View>
    </Pressable>}

    <View style={{ gap: 10 }}>
      <Copy style={s.label}>{t('search')}</Copy>
      <TextInput accessibilityLabel={t('search')} placeholder={t('searchHint')} placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} returnKeyType="search" clearButtonMode="while-editing" style={s.input} />
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 10 }}>{['all', ...categories].map(c => <Pressable accessibilityRole="button" accessibilityState={{ selected: c === category }} accessibilityLabel={c === 'all' ? t('all') : t(`categories.${c}`)} key={c} onPress={() => setCategory(c)} style={[s.chip, c === category && { backgroundColor: colors.green, borderColor: colors.green }]}><Copy style={{ color: c === category ? colors.white : colors.ink, fontSize: 14, fontWeight: '600' }}>{c === 'all' ? t('all') : t(`categories.${c}`)}</Copy></Pressable>)}</ScrollView>

    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
      <Copy style={s.label}>{t('recipesHeading')}</Copy>
      <Copy style={{ color: colors.muted, fontSize: 13 }}>{t('recipes', { count: visible.length })}</Copy>
    </View>
    {visible.length === 0 && <Card style={{ alignItems: 'center', paddingVertical: 28 }}><Copy style={{ fontSize: 30 }}>⌕</Copy><Copy style={[s.label, { textAlign: 'center' }]}>{t('noResults')}</Copy><Copy style={{ color: colors.muted, textAlign: 'center' }}>{t('trySearch')}</Copy><Button secondary title={t('clearSearch')} onPress={() => { setQuery(''); setCategory('all'); }} /></Card>}
    {list.map((recipe, i) => <Pressable key={recipe.id} accessibilityRole="button" accessibilityLabel={t('openRecipe', { title: recipe.title })} onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 14 }}>
        <View style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: artColors[i % artColors.length], alignItems: 'center', justifyContent: 'center' }}><Copy accessible={false} style={{ fontFamily: 'serif', fontSize: 31, color: colors.green }}>{recipe.title.substring(0, 1)}</Copy></View>
        <View style={{ flex: 1, gap: 5 }}><Copy style={s.eyebrow}>{t(`categories.${recipe.category}`)}</Copy><Copy numberOfLines={1} style={{ fontFamily: 'serif', fontSize: 20, lineHeight: 25, color: colors.ink }}>{recipe.title}</Copy><Copy style={{ color: colors.muted, fontSize: 13 }}>{recipe.servings ? t('portions', { count: Number(recipe.servings) }) : t('by', { name: recipe.author === 'demo' ? t('sampleName') : recipe.author })}</Copy></View>
        <Copy style={{ color: colors.muted, fontSize: 24 }}>›</Copy>
      </Card>
    </Pressable>)}
    <Button secondary title={t('add')} onPress={() => router.push('/editor')} />
  </Page>;
}
