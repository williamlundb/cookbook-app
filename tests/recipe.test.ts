import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { emptyRecipe, recipeSchema, searchRecipes, lines } from '../src/domain/recipe.ts';

test('only title is required and is trimmed', () => { assert.equal(recipeSchema.parse({ ...emptyRecipe, title: '  Soup  ' }).title, 'Soup'); assert.equal(recipeSchema.safeParse(emptyRecipe).success, false); });
test('rejects invalid counts, categories and oversized input', () => { for (const input of [{ servings: '-1' }, { servings: '1.5' }, { cookMinutes: 'ten' }, { category: 'public' }, { title: 'x'.repeat(161) }]) assert.equal(recipeSchema.safeParse({ ...emptyRecipe, title: 'Soup', ...input }).success, false); });
test('search includes ingredients and combines with category', () => { const recipes = [{ ...emptyRecipe, title: 'Soup', ingredients: 'Tomato', id: '1', cookbookId: 'demo', author: 'Mum' }]; assert.equal(searchRecipes(recipes, ' TOMATO ', 'all').length, 1); assert.equal(searchRecipes(recipes, 'tomato', 'baking').length, 0); assert.deepEqual(lines(' a\n\n b '), ['a', 'b']); });
test('Swedish and English contain the same translation keys', () => { const load = (lang: string) => JSON.parse(readFileSync(new URL(`../src/locales/${lang}.json`, import.meta.url), 'utf8')); const keys = (value: Record<string, unknown>, prefix = ''): string[] => Object.entries(value).flatMap(([key, v]) => typeof v === 'object' && v !== null ? keys(v as Record<string, unknown>, `${prefix}${key}.`) : [`${prefix}${key}`]).sort(); assert.deepEqual(keys(load('sv')), keys(load('en'))); });
