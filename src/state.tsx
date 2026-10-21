import { createContext, useContext, useState, type ReactNode } from 'react';
import { samples } from './data/samples';
import type { Recipe, RecipeInput } from './domain/recipe';

type Store = { recipes: Recipe[]; save: (value: RecipeInput, id?: string) => string; remove: (id: string) => void };
const Context = createContext<Store | null>(null);
export function CookbookProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(samples);
  const save: Store['save'] = (value, id) => {
    const key = id ?? `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setRecipes(current => id ? current.map(r => r.id === id ? { ...r, ...value } : r) : [{ ...value, id: key, cookbookId: 'demo', author: 'demo' }, ...current]);
    return key;
  };
  return <Context.Provider value={{ recipes, save, remove: id => setRecipes(current => current.filter(r => r.id !== id)) }}>{children}</Context.Provider>;
}
export function useCookbook() { const value = useContext(Context); if (!value) throw new Error('CookbookProvider missing'); return value; }
