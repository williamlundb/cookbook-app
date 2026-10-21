import { Alert, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { router, useLocalSearchParams, usePreventRemove } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { categories, emptyRecipe, recipeSchema, type RecipeInput } from '../domain/recipe';
import { useCookbook } from '../state';
import { Button, Copy, Heading, Page, colors, s } from '../ui';

export default function RecipeEditor() {
  const { id } = useLocalSearchParams<{ id?: string }>(); const { recipes, save } = useCookbook(); const { t } = useTranslation(); const [discarding, setDiscarding] = useState(false);
  const existing = recipes.find(r => r.id === id);
  const { control, handleSubmit, formState: { isDirty, isSubmitSuccessful } } = useForm<RecipeInput>({ defaultValues: existing ?? emptyRecipe, resolver: value => {
    const result = recipeSchema.safeParse(value);
    if (result.success) return { values: result.data, errors: {} };
    const errors: FieldErrors<RecipeInput> = {};
    for (const issue of result.error.issues) { const key = issue.path[0] as keyof RecipeInput; errors[key] = { type: 'validate', message: issue.message }; }
    return { values: {}, errors };
  } });
  usePreventRemove(isDirty && !isSubmitSuccessful && !discarding, ({ repeat }) => { Alert.alert(t('notSaved'), t('notSavedBody'), [{ text: t('keepEditing'), style: 'cancel' }, { text: t('leave'), style: 'destructive', onPress: () => { setDiscarding(true); repeat(); } }]); });
  const submit = handleSubmit(value => { save(value, id); }, () => Alert.alert(t('invalid')));
  useEffect(() => { if (isSubmitSuccessful) router.back(); }, [isSubmitSuccessful]);
  const fields = ['title', 'servings', 'prepMinutes', 'cookMinutes', 'ingredients', 'steps', 'tips'] as const;
  if (id && !existing) return <Page><Copy>{t('missing')}</Copy><Button title={t('back')} onPress={() => router.back()} /></Page>;
  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><Page><Button secondary title={t('cancel')} onPress={() => router.back()} /><Heading>{t(id ? 'editHeading' : 'newRecipe')}</Heading><Copy>{t('onlyTitle')}</Copy>
    {fields.map(name => { const multiline = ['ingredients', 'steps', 'tips'].includes(name); const numeric = ['servings', 'prepMinutes', 'cookMinutes'].includes(name); return <View key={name} style={{ gap: 8 }}><Copy style={s.label}>{t(name)}</Copy><Controller control={control} name={name} render={({ field: { value, onChange, onBlur } }) => <TextInput accessibilityLabel={t(name)} value={value} onChangeText={onChange} onBlur={onBlur} multiline={multiline} keyboardType={numeric ? 'number-pad' : 'default'} placeholder={t(name === 'title' ? 'nameHint' : multiline ? 'onePerLine' : 'optional')} placeholderTextColor={colors.muted} style={[s.input, multiline && { minHeight: 120, textAlignVertical: 'top' }]} />} /></View>; })}
    <Copy style={s.label}>{t('category')}</Copy><Controller control={control} name="category" render={({ field: { value, onChange } }) => <View style={s.row}>{categories.map(c => <Pressable key={c} accessibilityRole="button" accessibilityLabel={t(`categories.${c}`)} accessibilityState={{ selected: value === c }} onPress={() => onChange(c)} style={[s.chip, value === c && { backgroundColor: colors.green }]}><Copy style={{ color: value === c ? colors.white : colors.ink }}>{t(`categories.${c}`)}</Copy></Pressable>)}</View>} />
    <Button title={t('save')} onPress={() => { void submit(); }} />
  </Page></KeyboardAvoidingView>;
}
