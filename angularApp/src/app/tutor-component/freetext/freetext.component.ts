import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-freetext',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './freetext.component.html',
  styleUrls: ['./freetext.component.css'],
})
export class FreetextComponent {
  taskTitle: string | null = null;
  task: any;
  answer: string = '';
  correctAnswer: string = ''; // Die richtige Antwort hier hinterlegen
  isCorrect: boolean | null = null; // Wird gesetzt, wenn der Nutzer eine Antwort abgegeben hat
  feedback: string = '';
  correctFeedback: string = '';


  constructor(private route: ActivatedRoute, public taskService: TaskService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskTitle = params['title'];
      console.log('Task title:', this.taskTitle);
      if (this.taskTitle) {
        this.taskService.getTask(this.taskTitle).subscribe((response) => {
          this.task = response.data;
          this.correctAnswer = this.task.solution;
          this.correctFeedback = this.task.feedback;
          console.log(this.task);
        });
      }
    });
  }

  // Methode, um die Antwort zu überprüfen
  submitAnswer(): void {
    if (this.answer.trim() === this.correctAnswer) {
      this.isCorrect = true; // Antwort ist korrekt
      console.log('Correct Answer');
      this.feedback = this.correctFeedback;
    } else {
      this.isCorrect = false; // Antwort ist falsch
      console.log('Incorrect Answer');
      this.feedback = 'Answer is incorrect, pleasy try again!';
    }
  }
}
