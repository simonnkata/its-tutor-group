import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

interface Task {
  name: string;
  type: string;
  category: string;
  skill: string;
}

@Component({
  selector: 'app-tasks-overview',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './tasks-overview.component.html',
  styleUrls: ['./tasks-overview.component.sass']
})

export class TasksOverviewComponent {
  tasks: Task[] = [];
  beginnerTasks: Task[] = [];
  advanceTasks: Task[] = [];
  expertTasks: Task[] = [];
  filters: any;

  constructor(private router: Router) {
    this.filters = JSON.parse(localStorage.getItem('filters') ?? '');
  }

  createTask(): void {
    this.filters = JSON.parse(localStorage.getItem('filters') ?? '');

    const name = `${this.filters.category} - ${this.filters.type} - ${this.filters.skill}`;
    const task: Task = {
      name: name,
      type: this.filters.type,
      category: this.filters.category,
      skill: this.filters.skill,
    };

    this.tasks.push(task);
    this.sortTasks();
  }

  sortTasks(): void {
    this.beginnerTasks = this.tasks.filter(task => task.skill === 'beginner');
    this.advanceTasks = this.tasks.filter(task => task.skill === 'advance');
    this.expertTasks = this.tasks.filter(task => task.skill === 'expert');
  }

  editTask(task: Task): void {
    console.log('Edit task:', task);
  }

  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t !== task);
    this.sortTasks(); // Aktualisiere die Arrays nach dem Löschen
  }
}



