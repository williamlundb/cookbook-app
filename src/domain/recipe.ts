import { z } from 'zod';

export const categories = ['baking', 'breakfast', 'dinner', 'soups', 'sides', 'desserts', 'drinks', 'holidays', 'other'] as const;
export const recipeSchema = z.object({
  title: z.string().trim().min(1).max(160),
  category: z.enum(categories),
  ingredients: z.string().max(12000),
  steps: z.string().max(20000),
  tips: z.string().max(4000),
  servings: z.string().refine(v => v === '' || (/^\d+$/.test(v) && Number(v) > 0 && Number(v) <= 1000)),
  prepMinutes: z.string().refine(v => v === '' || (/^\d+$/.test(v) && Number(v) <= 10080)),
  cookMinutes: z.string().refine(v => v === '' || (/^\d+$/.test(v) && Number(v) <= 10080)),
});
export type RecipeInput = z.infer<typeof recipeSchema>;
export type Recipe = RecipeInput & { id: string; author: string; cookbookId: string };
export function lines(value: string): string[] { return value.split('\n').map(s => s.trim()).filter(Boolean); }
export function searchRecipes(recipes: Recipe[], term: string, category: string): Recipe[] {
  const query = term.trim().toLocaleLowerCase();
  return recipes.filter(r => (category === 'all' || r.category === category) && `${r.title} ${r.ingredients}`.toLocaleLowerCase().includes(query));
}
export const emptyRecipe: RecipeInput = { title: '', category: 'other', ingredients: '', steps: '', tips: '', servings: '', prepMinutes: '', cookMinutes: '' };
