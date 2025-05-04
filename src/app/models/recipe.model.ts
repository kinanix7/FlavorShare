export interface Recipe {
  id?: number;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  imageUrl: string;
  category: string;
  tags: string[];
  createdAt: string;
}