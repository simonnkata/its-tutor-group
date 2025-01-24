import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgStyle } from '@angular/common';
@Component({
  selector: 'app-gap',
  standalone: true,
  imports: [DropdownModule, FormsModule, NgIf, NgFor, NgStyle],
  templateUrl: './gap.component.html',
  styleUrl: './gap.component.css',
})
export class GapComponent {
  taskTitle: string | null = null;
  task: any = null;
  codeSection: any = null;
  answers: string[] = [];
  answersCount: number = 0;
  feedback: string = '';

  constructor(private route: ActivatedRoute, public taskService: TaskService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskTitle = params['title'];
      if (this.taskTitle) {
        this.codeSection = '';
        this.taskService.getTask(this.taskTitle).subscribe((response) => {
          this.task = response.data;
          this.codeSection = this.task.description[1].code;
          const gap = document.getElementById('gap-section');
          if (gap) {
            gap.innerText = this.codeSection;
          }
          this.answersCount = 0;
          this.processGaps();
        });
      }
    });
  }

  processGaps() {
    const gap = document.getElementById('gap-section');
    var gapContent = gap?.innerHTML || '';
    gapContent = gapContent?.replace(
      new RegExp('&lt;&lt;Gap&gt;&gt;', 'g'),
      (_, index) => {
        var result = `<span id="gap${this.answersCount}" contenteditable="true" class="blank" style="background-color: white;width: 100px;color: black;display: inline-block;border-radius: 5px; border: 1px solid black"></span>`;
        this.answersCount += 1;
        return result;
      }
    );
    if (gap) gap.innerHTML = gapContent;
  }

  submitAnswer() {
    var answers = [];
    for (let index = 0; index < this.answersCount; index++) {
      var textbox = document.getElementById(`gap${index}`);
      const element = textbox?.innerText;
      if (element) {
        answers.push(element);
      }
    }
    this.answers = answers;
    this.evaluateAnswer();
  }

  evaluateAnswer() {
    var correct = true;
    for (let index = 0; index < this.answers.length; index++) {
      var gap = document.getElementById(`gap${index}`);
      if (this.answers[index] !== this.task.solution[index]) {
        correct = false;
        if (gap) {
          gap.style.border = '3px solid red';
        }
      } else {
        if (gap) {
          gap.style.border = '3px solid green';
        }
      }
    }
    if (correct) {
      this.feedback = 'Correct!';
    } else {
      this.feedback = 'Incorrect!';
    }
    const textbox = document.getElementById('feedback');
    if (textbox) {
      textbox.style.visibility = 'visible';
    }
  }
}
