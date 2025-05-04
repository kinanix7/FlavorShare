import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuCollapsed = true;
  searchQuery = '';

  constructor(private router: Router) { }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/recipes'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
      this.searchQuery = '';
      this.isMenuCollapsed = true;
    }
  }
}