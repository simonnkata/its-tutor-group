import { Component } from '@angular/core';

@Component({
  selector: 'app-flowchart-task',
  standalone: true,
  imports: [],
  templateUrl: './flowchart-task.component.html',
  styleUrl: './flowchart-task.component.sass'
})
export class FlowchartTaskComponent {

}
// import { Component, OnInit } from '@angular/core';
// import { TaskService } from '../../services/task.service';
// import { FormsModule, NgModel } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';


// @Component({
//   selector: 'app-compiler-task',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './compiler-task.component.html',
//   styleUrl: './compiler-task.component.sass'
// })
// export class CompilerTaskComponent implements OnInit{
//   taskName: string = ''; // Für den Task-Namen
//   errorMessage: string = '';

//   type: string = ''
//   category: string = ''
//   skillLevel: string = ''

//   constructor(private taskService: TaskService,
//     private router: ActivatedRoute,
//     private httpClient: HttpClient
//   ) {
//     taskService.data$.subscribe((data) => {
//       this.type = data.type
//       this.category = data.category
//       this.skillLevel = data.skill
//     })

//     this.router.queryParams.subscribe((params) => {
//       this.type = params['type']
//       this.category = params['category']
//       this.skillLevel = params['skill']
//     })
//   }

//   ngOnInit(): void {}

  
  
//   save(){
//     alert('saving')
//   }

//   create()
//   {
//     let baseUrl = "http://127.0.0.1:5000/";

//     let headers = new HttpHeaders({
//       Authorization: 'Bearer ' + localStorage.getItem('token')
//     });

//     this.httpClient.post(baseUrl + 'task', {
//       'difficultyLevel': this.skillLevel,
//       'topic' : this.category,
//       'type': this.type
//     }, 
//     {'headers': headers}
//   ).subscribe((response) => {
//       console.log(response)
//     })

//   }

// }

