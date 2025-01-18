import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { TaskService } from '../services/task.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher',
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
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.sass',
})
export class TeacherComponent implements OnInit {
  private subscription!: Subscription;
  title = 'Python Tutor';

  currentUser = localStorage.getItem('currentUser');
  currentUserInfo = this.currentUser ? JSON.parse(this.currentUser) : null;
  currentUsername: String = this.currentUserInfo?.username || 'Guest';

  currentPage: string = '/tasks-overview'; // Standardseite: Tasks Overview

  filters: any;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService
  ) {
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

    this.authService.currentUser.subscribe((currentUser) => {
      this.currentUsername = currentUser.username;
    });
  }
  ngOnInit(): void {
    // Listen to navigation events
    this.subscription = this.router.events.subscribe((event) => {
      console.log('Event:', event);
      if (event instanceof NavigationEnd) {
        this.currentUser = localStorage.getItem('currentUser');
        if (this.currentUser) {
          this.currentUserInfo = this.currentUser
            ? JSON.parse(this.currentUser)
            : null;
          this.currentUsername = this.currentUserInfo?.username || 'Guest';
        }
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
    this.authService.logout();
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

  isTeacherPage(): boolean {
    const result = this.router.url.includes('/teacher');
    return result;
  }
}
