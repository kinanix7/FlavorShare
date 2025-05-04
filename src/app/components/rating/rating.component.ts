import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rating } from '../../models/rating.model';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {
  @Input() recipeId!: number;
  @Input() existingRatings: Rating[] = [];
  
  ratings: Rating[] = [];
  averageRating = 0;
  averageRatingText = '0 out of 5';
  
  userRating = 0;
  hoverRating = 0;
  userComment = '';
  submitting = false;

  userId = 'user' + Math.floor(Math.random() * 1000);

  constructor(private ratingService: RatingService) { }

  ngOnInit(): void {
    this.ratings = this.existingRatings;
    this.calculateAverageRating();
  }

  ngOnChanges(): void {
    if (this.existingRatings) {
      this.ratings = this.existingRatings;
      this.calculateAverageRating();
    }
  }

  calculateAverageRating(): void {
    if (this.ratings.length === 0) {
      this.averageRating = 0;
      this.averageRatingText = 'No ratings yet';
      return;
    }
    
    const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
    this.averageRatingText = `${this.averageRating.toFixed(1)} out of 5`;
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }

  canSubmit(): boolean {
    return this.userRating > 0 && this.userComment.trim().length > 0;
  }

  submitRating(): void {
    if (!this.canSubmit()) return;
    
    this.submitting = true;
    
    const newRating: Rating = {
      recipeId: this.recipeId,
      userId: this.userId,
      rating: this.userRating,
      comment: this.userComment.trim(),
      createdAt: new Date().toISOString()
    };
    
    this.ratingService.addRating(newRating).subscribe({
      next: (rating) => {
        this.ratings.unshift(rating);
        this.calculateAverageRating();
        this.resetForm();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error adding rating', error);
        this.submitting = false;
      }
    });
  }

  resetForm(): void {
    this.userRating = 0;
    this.userComment = '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}