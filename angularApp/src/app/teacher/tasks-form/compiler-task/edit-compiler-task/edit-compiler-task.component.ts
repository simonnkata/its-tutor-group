import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Task {
  title: string;
  type: string;
  topic: string;
  difficultyLevel: string;
  description: {
    0: {
      text: string
    },
    1: {
      code: string
    },
    2: {
      text: string
    }
  }
  color?: string;
  code: string;
  rest: string;
  solution: string;
  feedback: string;
}

@Component({
  selector: 'app-edit-compiler-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-compiler-task.component.html',
  styleUrl: './edit-compiler-task.component.sass',
})
export class EditCompilerTaskComponent {
  title!: any;
  type: any;

  task!: Task;

  constructor(
    private activatedRotue: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.activatedRotue.params.subscribe((params) => {
      this.title = params['title'];

      this.taskService.getTask(this.title).subscribe((info: any) => {
        this.task = info.data;
        this.type = info.data.type;
        console.log(this.task);
      });
    });
  }


  save() {
    let task = this.task

    this.taskService.updateTask(task).subscribe({
      next: (response: { status: string; data: string; message?: string }) => {
        this.router.navigate(['/teacher/tasks-overview']);
        if (response.status === 'successful') {
          this.showSuccessMessage();
          // this.resetForm();
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
  showSuccessMessage(): void {
    this.snackBar.open('Task saved successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  
}

