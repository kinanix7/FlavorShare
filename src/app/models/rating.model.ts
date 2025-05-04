export interface Rating {
  id?: number;
  recipeId: number;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}