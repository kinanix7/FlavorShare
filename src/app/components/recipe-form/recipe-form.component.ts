import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent implements OnInit {
  recipeForm!: FormGroup;
  isEditMode = false;
  recipeId!: number;
  submitting = false;
  
  availableTags = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb',
    'keto', 'paleo', 'quick', 'easy', 'breakfast', 'lunch', 'dinner',
    'dessert', 'healthy', 'italian', 'mexican', 'asian', 'indian'
  ];
  
  selectedTags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.recipeId = +params['id'];
        this.loadRecipe();
      }
    });
  }

  initForm(): void {
    this.recipeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.*')]],
      category: ['', [Validators.required]],
      prepTime: [15, [Validators.required, Validators.min(1)]],
      cookTime: [20, [Validators.required, Validators.min(0)]],
      servings: [4, [Validators.required, Validators.min(1)]],
      difficulty: ['', [Validators.required]],
      ingredients: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      steps: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  loadRecipe(): void {
    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (recipe) => {
        this.recipeForm.patchValue({
          name: recipe.name,
          description: recipe.description,
          imageUrl: recipe.imageUrl,
          category: recipe.category,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty
        });
        
        this.clearFormArray(this.ingredientsArray);
        recipe.ingredients.forEach(ingredient => {
          this.ingredientsArray.push(this.fb.control(ingredient, Validators.required));
        });
        
        this.clearFormArray(this.stepsArray);
        recipe.steps.forEach(step => {
          this.stepsArray.push(this.fb.control(step, Validators.required));
        });
        
        this.selectedTags = [...recipe.tags];
        
        this.recipeForm.markAsPristine();
      },
      error: (error) => {
        console.error('Error loading recipe', error);
      }
    });
  }

  clearFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  onSubmit(): void {
    if (this.recipeForm.invalid) {
      this.markFormGroupTouched(this.recipeForm);
      return;
    }
    
    this.submitting = true;
    
    const recipeData: Recipe = {
      ...this.recipeForm.value,
      tags: this.selectedTags,
      createdAt: new Date().toISOString()
    };
    
    if (this.isEditMode) {
      this.recipeService.updateRecipe(this.recipeId, recipeData).subscribe({
        next: () => {
          this.router.navigate(['/recipes', this.recipeId]);
        },
        error: (error) => {
          console.error('Error updating recipe', error);
          this.submitting = false;
        }
      });
    } else {
      this.recipeService.createRecipe(recipeData).subscribe({
        next: (newRecipe) => {
          this.router.navigate(['/recipes', newRecipe.id]);
        },
        error: (error) => {
          console.error('Error creating recipe', error);
          this.submitting = false;
        }
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get ingredientsArray(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredientsArray.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number): void {
    this.ingredientsArray.removeAt(index);
  }

  get stepsArray(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  addStep(): void {
    this.stepsArray.push(this.fb.control('', Validators.required));
  }

  removeStep(index: number): void {
    this.stepsArray.removeAt(index);
  }

  onTagChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const tag = input.value;
    
    if (input.checked) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag);
      }
    } else {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    }
  }

  //  validation
  get nameControl() { return this.recipeForm.get('name')!; }
  get categoryControl() { return this.recipeForm.get('category')!; }
  get descriptionControl() { return this.recipeForm.get('description')!; }
  get imageUrlControl() { return this.recipeForm.get('imageUrl')!; }
  get prepTimeControl() { return this.recipeForm.get('prepTime')!; }
  get cookTimeControl() { return this.recipeForm.get('cookTime')!; }
  get servingsControl() { return this.recipeForm.get('servings')!; }
  get difficultyControl() { return this.recipeForm.get('difficulty')!; }
}