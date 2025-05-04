import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RecipeCardComponent],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent implements OnInit {
  allRecipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  loading = true;
  activeFilter = 'all';
  categoryFilter = '';
  searchQuery = '';
  categories: string[] = [];

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.loadRecipes();
    });
  }

  loadRecipes(): void {
    this.loading = true;
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.allRecipes = recipes;
        
        this.categories = [...new Set(recipes.map(recipe => recipe.category))];
        
        if (this.searchQuery) {
          this.filteredRecipes = this.allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()))
          );
        } else {
          this.filteredRecipes = [...this.allRecipes];
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching recipes', error);
        this.loading = false;
      }
    });
  }

  filterRecipes(filter: string): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredRecipes = [...this.allRecipes];
    } else if (filter === 'quick') {
      this.filteredRecipes = this.allRecipes.filter(recipe => 
        (recipe.prepTime + recipe.cookTime) < 30
      );
    } else {
      this.filteredRecipes = this.allRecipes.filter(recipe => 
        recipe.tags.includes(filter)
      );
    }
    
    if (this.categoryFilter) {
      this.filteredRecipes = this.filteredRecipes.filter(recipe => 
        recipe.category === this.categoryFilter
      );
    }
  }

  filterByCategory(): void {
    this.filterRecipes(this.activeFilter);
    
    if (this.categoryFilter) {
      this.filteredRecipes = this.filteredRecipes.filter(recipe => 
        recipe.category === this.categoryFilter
      );
    }
  }

  searchRecipes(): void {
    if (this.searchQuery.trim()) {
      this.filteredRecipes = this.allRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    } else {
      this.filteredRecipes = [...this.allRecipes];
    }
  }
}