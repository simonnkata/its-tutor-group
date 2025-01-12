import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var Prism: any; // To use Prism globally

@Component({
  selector: 'app-gap-task',
  standalone: true,
  imports: [],
  templateUrl: './gap-task.component.html',
  styleUrl: './gap-task.component.sass'
})

export class GapTaskComponent implements OnInit, AfterViewInit{
  taskName: string = ''; // Dynamischer Task-Name
  errorMessage: string = '';

  type: string = ''
  category: string = ''
  skillLevel: string = ''

  constructor(private taskService: TaskService,
    private router: ActivatedRoute,
    private httpClient: HttpClient
  ) {
    taskService.data$.subscribe((data) => {
      this.type = data.type
      this.category = data.category
      this.skillLevel = data.skill
    })

    this.router.queryParams.subscribe((params) => {
      this.type = params['type']
      this.category = params['category']
      this.skillLevel = params['skill']
    })
  }
  ngAfterViewInit(): void {
    // Apply syntax highlighting after the view is initialized
    Prism.highlightAll();
  }

  ngOnInit(): void {
    this.generateTaskTitle();
  }

  generateTaskTitle(): void {
    this.taskService.generateTaskTitle(this.category, this.type).subscribe({
      next: (response: { status: string; title: string; message?: string }) => {
        if (response.status === 'success') {
          this.taskName = response.title;
        } else {
          this.errorMessage = response.message || 'Error generating task name.';
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching task name.';
        console.error(err);
      },
    });
  }
  
  save(){
    alert('saving')
  }

  create()
  {
    let baseUrl = "http://127.0.0.1:5000/";

    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });

    this.httpClient.post(baseUrl + 'task', {
      'difficultyLevel': this.skillLevel,
      'topic' : this.category,
      'type': this.type
    }, 
    {'headers': headers}
  ).subscribe((response) => {
      console.log(response)
    })

  }

}

