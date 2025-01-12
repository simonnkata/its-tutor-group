import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgIf } from '@angular/common';
declare var Prism: any; // To use Prism globally

@Component({
  selector: 'app-flowchart-task',
  standalone: true,
  imports: [NgIf],
  templateUrl: './flowchart-task.component.html',
  styleUrl: './flowchart-task.component.sass',
})
export class FlowchartTaskComponent implements AfterViewInit {
  taskName: string = ''; // Dynamischer Task-Name
  errorMessage: string = '';

  type: string = '';
  category: string = '';
  skillLevel: string = '';
  loading: boolean = false;

  constructor(
    private taskService: TaskService,
    private router: ActivatedRoute,
    private httpClient: HttpClient
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
        if (response.status === 'successful') {
          this.taskName = response.title;
        } else {
          this.errorMessage = response.message || 'Error generating task name.';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching task name.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  save() {
    alert('saving');
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
}
