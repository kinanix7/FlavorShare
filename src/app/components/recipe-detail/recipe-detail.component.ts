import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { Rating } from '../../models/rating.model';
import { RecipeService } from '../../services/recipe.service';
import { RatingService } from '../../services/rating.service';
import { RatingComponent } from '../rating/rating.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingComponent, ConfirmDialogComponent],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  recipeId!: number;
  ratings: Rating[] = [];
  loading = true;
  showDeleteConfirmation = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private ratingService: RatingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipeId = +params['id'];
      this.loadRecipe();
      this.loadRatings();
    });
  }

  loadRecipe(): void {
    this.loading = true;
    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching recipe', error);
        this.loading = false;
      }
    });
  }

  loadRatings(): void {
    this.ratingService.getRatingsByRecipeId(this.recipeId).subscribe({
      next: (ratings) => {
        this.ratings = ratings;
      },
      error: (error) => {
        console.error('Error fetching ratings', error);
      }
    });
  }

  deleteRecipe(): void {
    this.recipeService.deleteRecipe(this.recipeId).subscribe({
      next: () => {
        this.router.navigate(['/recipes']);
      },
      error: (error) => {
        console.error('Error deleting recipe', error);
      }
    });
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
  }
}