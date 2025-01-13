import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { TaskService } from './services/task.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DropdownModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'Python Tutor';

  currentUser = localStorage.getItem('currentUser');
  currentUserInfo = this.currentUser ? JSON.parse(this.currentUser) : null;
  currentUsername: String = this.currentUserInfo?.username || 'Guest';

  currentPage: string = 'teacher/tasks-overview'; // Standardseite: Tasks Overview

  filters: any;

  constructor(private router: Router, private taskService: TaskService) {
    this.filters = {
      category: 'Variables',
      skill: 'beginner',
      type: 'compiler-task',
    };

    localStorage.setItem('filters', JSON.stringify(this.filters));
    //localStorage.setItem('token', 'dein-jwt-token');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPage = event.urlAfterRedirects;
      }
    });
  }

  // Methode, um die Seite zu ändern
  navigate(): void {
    if (this.selectedType == 'compiler-task') {
      this.router.navigate(['teacher/compiler-task'], {
        queryParams: this.filters,
      });
    } else if (this.selectedType == 'flowchart-task') {
      this.router.navigate(['teacher/flowchart-task'], {
        queryParams: this.filters,
      });
    } else if (this.selectedType == 'free-text-task') {
      this.router.navigate(['teacher/free-text-task'], {
        queryParams: this.filters,
      });
    } else {
      this.router.navigate(['teacher/gap-task'], {
        queryParams: this.filters,
      });
    }

    this.taskService.send(this.filters);
  }

  // Logout-Methode
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.currentUserInfo = null;
    this.currentUsername = 'Guest';
    this.router.navigateByUrl('/signup'); // Beispiel-Redirect zur Login-Seite
  }

  selectedType: string = 'compiler-task';
  selectedCategory: string = 'Variables';
  selectedSkill: string = 'beginner';

  @Output() filterChanged = new EventEmitter<any>();

  onFilterChange(): void {
    const filters = {
      type: this.selectedType,
      category: this.selectedCategory,
      skill: this.selectedSkill,
    };
    this.filters = filters;
    console.log('Filters changed:', filters);
    localStorage.setItem('filters', JSON.stringify(this.filters));
    this.filterChanged.emit(filters);
  }

  isSignupPage(): boolean {
    console.log(this.router.url);
    return this.router.url.includes('/signup');
  }

  isTeacherPage(): boolean {
    const result = this.router.url.includes('/teacher');
    return result;
  }
}
