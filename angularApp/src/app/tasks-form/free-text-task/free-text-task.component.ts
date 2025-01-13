import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf, NgForOf } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var Prism: any; // To use Prism globally

@Component({
  selector: 'app-free-text-task',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule, MatSnackBarModule],
  templateUrl: './free-text-task.component.html',
  styleUrl: './free-text-task.component.sass',
})
export class FreeTextTaskComponent {
  taskName: string = ''; // Dynamischer Task-Name
  errorMessage: string = '';

  type: string = '';
  category: string = '';
  skillLevel: string = '';
  loading: boolean = false;
  hints: string[] = [''];
  description: string[] = ['', ''];
  solution: string = '';
  feedback: string = '';

  constructor(
    private taskService: TaskService,
    private router: ActivatedRoute,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar
  ) {
    taskService.data$.subscribe((data) => {
      this.type = data.type;
      this.category = data.category;
      this.skillLevel = data.skill;
    });

    this.router.queryParams.subscribe((params) => {
      this.type = params['type'];
      this.category = params['category'];
      this.skillLevel = params['skill'];
      this.generateTaskTitle();
    });
  }
  ngAfterViewInit(): void {
    // Apply syntax highlighting after the view is initialized
    Prism.highlightAll();
  }

  generateTaskTitle(): void {
    this.loading = true;
    this.taskService.generateTaskTitle(this.category, this.type).subscribe({
      next: (response: { status: string; title: string; message?: string }) => {
        console.log(this.category, this.type);
        if (response.status === 'successful') {
          this.taskName = response.title;
        } else {
          this.errorMessage = response.message || 'Error generating task name.';
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.log(this.category, this.type);
        this.errorMessage = 'Error fetching task name.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  save() {
    var taskDescription = [];
    taskDescription[0] = { text: this.description[0] };
    taskDescription[1] = { code: this.description[1] };
    var task = {
      title: this.taskName,
      difficultyLevel: this.skillLevel,
      topic: this.category,
      type: this.type,
      description: taskDescription,
      hints: this.hints,
      points: 2,
      solution: this.solution,
      keywords: [],
      availableLines: [],
    };
    console.log(task);
    this.taskService.createTask(task).subscribe({
      next: (response: { status: string; data: string; message?: string }) => {
        if (response.status === 'successful') {
          this.showSuccessMessage();
          this.resetForm();
        } else {
          alert('Error creating task.');
        }
      },
      error: (err: any) => {
        alert('Error creating task.');
        console.error(err);
      },
    });
  }

  create() {
    let baseUrl = 'http://127.0.0.1:5000/';

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    this.httpClient
      .post(
        baseUrl + 'task',
        {
          difficultyLevel: this.skillLevel,
          topic: this.category,
          type: this.type,
        },
        { headers: headers }
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  addHint(): void {
    this.hints.push('');
  }
  removeHint(index: number): void {
    this.hints.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  showSuccessMessage(): void {
    this.snackBar.open('Task saved successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  resetForm(): void {
    this.generateTaskTitle();
    this.description = ['', '', ''];
    this.solution = '';
    this.hints = [''];
    this.feedback = '';
  }
}
