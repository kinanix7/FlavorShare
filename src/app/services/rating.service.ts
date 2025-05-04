import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:3000/ratings';

  constructor(private http: HttpClient) { }

  getRatingsByRecipeId(recipeId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}?recipeId=${recipeId}`);
  }

  addRating(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(this.apiUrl, rating);
  }

  updateRating(id: number, rating: Rating): Observable<Rating> {
    return this.http.put<Rating>(`${this.apiUrl}/${id}`, rating);
  }

  deleteRating(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAverageRatingForRecipe(recipeId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}?recipeId=${recipeId}`);
  }
}