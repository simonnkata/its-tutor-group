import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  title: string;
  type: string;
  topic: string;
  difficultyLevel: string;
  description?: string;
  color?: string;
}

@Component({
  selector: 'app-edit-compiler-task',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './edit-compiler-task.component.html',
  styleUrl: './edit-compiler-task.component.sass'
})



export class EditCompilerTaskComponent {

  title!: any
  type: any


  task!: Task;

  constructor(private activatedRotue: ActivatedRoute, private taskService: TaskService){
    this.activatedRotue.params.subscribe((params) => {
      this.title = params['title']
      


      this.taskService.getTask(this.title).subscribe((info: any) => {
        this.task = info.data
        this.type = info.data.type
        console.log(this.task)
      })



    })

  }
}
