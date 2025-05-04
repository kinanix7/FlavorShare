import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg';
  }
}