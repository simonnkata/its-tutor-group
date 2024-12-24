import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Task {
  name: string;
  type: string;
  category: string;
  skillLevel: string;
}

@Component({
  selector: 'app-tasks-overview',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './tasks-overview.component.html',
  styleUrls: ['./tasks-overview.component.sass']
})

export class TasksOverviewComponent {
  tasks: Task[] = [];

  constructor(private router: Router) {}

  // Navigiert zur Seite für die Task-Erstellung
  createTask(): void {
    this.router.navigateByUrl('/tasks-form/compiler-task'); // Beispiel für Compiler Task
  }

  // Bearbeitet eine bestehende Task
  editTask(task: Task): void {
    console.log('Edit task:', task);
    // Implementieren Sie die Logik für das Bearbeiten
  }

  // Löscht eine bestehende Task
  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t !== task);
  }
}


