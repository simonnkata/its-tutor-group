import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output} from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Experience {
  name: string;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule, 
    FormsModule,
    RouterModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass',
    ],

})



export class AppComponent {
  title = 'Python Tutor';

  currentUser = localStorage.getItem("currentUser");
  currentUserInfo = this.currentUser ? JSON.parse(this.currentUser) : null;
  currentUsername: String = this.currentUserInfo?.username || 'Guest';

  currentPage: string = 'tasks-overview'; // Standardseite: Tasks Overview

  constructor(private router: Router) {}

  // Methode, um die Seite zu ändern
  navigateTo(page: string): void {
    this.currentPage = page;
  }

  // Logout-Methode
  logout(): void {
    localStorage.removeItem("currentUser");
    this.currentUser = null;
    this.currentUserInfo = null;
    this.currentUsername = 'Guest';
    this.router.navigateByUrl('/login'); // Beispiel-Redirect zur Login-Seite
  }

  selectedType: string = 'compiler-task';
  selectedCategory: string = 'Variables';
  selectedSkill: string = 'beginner';

  @Output() filterChanged = new EventEmitter<any>();

  onFilterChange(): void {
    const filters = {
      type: this.selectedType,
      category: this.selectedCategory,
      skill: this.selectedSkill
    };
    console.log('Filters changed:', filters);
    this.filterChanged.emit(filters);
  }
}








