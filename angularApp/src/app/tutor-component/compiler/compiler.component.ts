import { Component, output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { response } from 'express';

@Component({
  selector: 'app-compiler',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './compiler.component.html',
  styleUrl: './compiler.component.css',
})
export class CompilerComponent {
  taskTitle: string | null = null;
  task: any = null;
  taskDescription: string = "";
  codeSection: string = "";
  userAnswer: string = "";
  userOutput: string = "";
  hints: [string] = [""];
  feedbackAndIsCorrect: any = null;
  isCorrect: boolean = false;
  feedback: string = "";

  constructor(private route: ActivatedRoute, private taskService: TaskService) {
    taskService.data$.subscribe((data) => {
      this.userAnswer = data.userAnswer;
      this.userOutput = data.userOutput
    }
    )
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskTitle = params['title'];
      console.log('Task title:', this.taskTitle);
    });
    if (this.taskTitle) {
      this.taskService.getTask(this.taskTitle).subscribe((response) => {
        this.task = response.data;
        console.log(this.task);
        this.taskDescription = this.task.description[0].text;
        this.codeSection = this.task.description[1].code;
        console.log(this.taskDescription);
      });
    }
  }

  /* checkAnswer(): void {
    this.taskService.feedback(this.taskTitle).subscribe((response) => {
      this.feedbackAndIsCorrect = response.data;
      this.isCorrect = response.isCorrect;
      this.feedback = response.feedback;
    }); 
  } */


}
