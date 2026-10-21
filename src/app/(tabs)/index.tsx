import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCookbook } from '../../state';
import { categories, searchRecipes } from '../../domain/recipe';
import { Button, Card, Copy, Heading, Page, colors, s } from '../../ui';

export default function CookbookScreen() {
  const { t } = useTranslation(); const { recipes } = useCookbook();
  const [query, setQuery] = useState(''); const [category, setCategory] = useState('all');
  const visible = searchRecipes(recipes, query, category);
  return <Page><Copy style={s.eyebrow}>{t('demo')}</Copy><Heading>{t('bookName')}</Heading><Copy style={{ color: colors.muted }}>{t('bookDescription')}</Copy>
    <Card style={{ backgroundColor: colors.pale }}><Copy style={{ fontSize: 14, lineHeight: 21 }}>{t('demoNotice')}</Copy></Card>
    <Button title={t('add')} onPress={() => router.push('/editor')} />
    <TextInput accessibilityLabel={t('search')} placeholder={t('search')} placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} style={s.input} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{['all', ...categories].map(c => <Pressable accessibilityRole="button" accessibilityState={{ selected: c === category }} accessibilityLabel={c === 'all' ? t('all') : t(`categories.${c}`)} key={c} onPress={() => setCategory(c)} style={[s.chip, c === category && { backgroundColor: colors.green }]}><Copy style={{ color: c === category ? colors.white : colors.ink, fontSize: 15 }}>{c === 'all' ? t('all') : t(`categories.${c}`)}</Copy></Pressable>)}</ScrollView>
    <Copy style={s.eyebrow}>{t('recipes', { count: visible.length })}</Copy>
    {visible.length === 0 && <Card><Heading>{t('noResults')}</Heading><Copy>{t('trySearch')}</Copy></Card>}
    {visible.map((r, i) => <Pressable accessibilityRole="button" accessibilityLabel={t('openRecipe', { title: r.title })} key={r.id} onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: r.id } })}><Card><View style={{ height: 76, backgroundColor: i % 2 ? '#E5E9DF' : '#F2E5D5', borderRadius: 12, justifyContent: 'center', padding: 16 }}><Copy style={{ fontFamily: 'serif', fontSize: 30 }} accessible={false}>{r.title.substring(0, 1)}</Copy></View><Copy style={s.eyebrow}>{t(`categories.${r.category}`)}</Copy><Copy style={{ fontFamily: 'serif', fontSize: 26, lineHeight: 32 }}>{r.title}</Copy><Copy style={{ color: colors.muted, fontSize: 14 }}>{r.servings ? t('portions', { count: Number(r.servings) }) : t('by', { name: r.author === 'demo' ? t('sampleName') : r.author })}</Copy></Card></Pressable>)}
  </Page>;
}
