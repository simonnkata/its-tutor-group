import { Component, output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { response } from 'express';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-compiler',
  standalone: true,
  imports: [FormsModule, NgIf],
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
  errorMessage: string = "";
  correctAnswer: string = "";
  correctFeedback: string = "";

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
        this.correctAnswer = this.task.solution;
        /*this.correctFeedback = this.task.correctFeedback;*/
        this.correctFeedback = "Well done!"
        console.log(this.taskDescription);
      });
    }
  }

  submitAnswer(): void {
    if (this.userAnswer.trim() === this.correctAnswer) {
      this.isCorrect = true; // Antwort ist korrekt
      console.log('Correct Answer');
      this.feedback = this.correctFeedback;
    } else {
      this.isCorrect = false; // Antwort ist falsch
      console.log('Incorrect Answer');
      this.feedback = 'Answer is incorrect, please try again!';
    }

  /* checkAnswer(): void {
    if (this.taskTitle) {
    this.taskService.getFeedback(this.taskTitle, this.userAnswer, this.userOutput).subscribe({
       next: (response: { status: string; feedback: string, isCorrect: boolean; message?: string }) => {
        if (response.status === 'successful') {
          this.isCorrect = response.isCorrect;
          this.feedback = response.feedback;
          console.log(this.isCorrect)
        } else {
          this.errorMessage = response.message || 'Error checking answer.';
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Error checking answer.';
        console.error(err);
      },
    });
  }
  } */

}
}
