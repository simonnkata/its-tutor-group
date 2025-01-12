import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TaskService } from './services/task.service';

interface Experience {
  name: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'Python Tutor';

  currentUser = localStorage.getItem('currentUser');
  currentUserInfo = this.currentUser ? JSON.parse(this.currentUser) : null;
  currentUsername: String = this.currentUserInfo?.username || 'Guest';

  currentPage: string = 'tasks-overview'; // Standardseite: Tasks Overview

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
      this.router.navigate(['tasks-form/compiler-task'], {
        queryParams: this.filters,
      });
    } else if (this.selectedType == 'flowchart-task') {
      this.router.navigate(['tasks-form/flowchart-task'], {
        queryParams: this.filters,
      });
    } else if (this.selectedType == 'free-text-task') {
      this.router.navigate(['tasks-form/free-text-task'], {
        queryParams: this.filters,
      });
    } else {
      this.router.navigate(['tasks-form/gap-task'], {
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
      skill: this.selectedSkill,
    };
    this.filters = filters;
    console.log('Filters changed:', filters);
    localStorage.setItem('filters', JSON.stringify(this.filters));
    this.filterChanged.emit(filters);
  }

  isSignupPage(): boolean {
    return this.router.url.includes('/signup');
  }
}
