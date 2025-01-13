import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { OnInit } from '@angular/core';

interface Task {
  title: string;
  type: string;
  topic: string;
  difficultyLevel: string;
  description?: string;
  color?: string;
}

@Component({
  selector: 'app-tasks-overview',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, NgStyle],
  templateUrl: './tasks-overview.component.html',
  styleUrls: ['./tasks-overview.component.css'],
})
export class TasksOverviewComponent implements OnInit {
  tasks: Task[] = [];
  beginnerTasks: Task[] = [];
  advanceTasks: Task[] = [];
  expertTasks: Task[] = [];
  filters: any;

  constructor(private router: Router, private taskService: TaskService) {
    this.filters = JSON.parse(localStorage.getItem('filters') ?? '');
  }

  ngOnInit(): void {
    this.getTasks();
  }
  /*   createTask(): void {
    this.filters = JSON.parse(localStorage.getItem('filters') ?? '');

    const name = `${this.filters.category} - ${this.filters.type} - ${this.filters.skill}`;
    const task: Task = {
      name: name,
      type: this.filters.type,
      category: this.filters.category,
      skill: this.filters.skill,
    };

    this.tasks.push(task);
    this.sortTasks();
  } */

  /* sortTasks(): void {
    this.beginnerTasks = this.tasks.filter((task) => task.skill === 'beginner');
    this.advanceTasks = this.tasks.filter((task) => task.skill === 'advance');
    this.expertTasks = this.tasks.filter((task) => task.skill === 'expert');
  } */

  editTask(task: Task): void {
    console.log('Edit task:', task);
  }

  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter((t) => t !== task);
    //this.sortTasks(); // Aktualisiere die Arrays nach dem Löschen
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (response: any) => {
        console.log('Tasks:', response.data.tasks);
        this.processTasks(response.data.tasks);
        //var descriptionArray = response.data.tasks.description;
        //this.tasks = response.data.tasks;
        //this.tasks.description = response.data.tasks.description;
        //this.sortTasks();
      },
      error: (error: any) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  processTasks(tasks: any): void {
    tasks.forEach((task: any) => {
      var description = task.description[0].text;
      var title = task.title;
      var type = task.type;
      var topic = task.topic;
      var difficultyLevel = task.difficultyLevel;
      var color;
      if (difficultyLevel == 'beginner') {
        color = '#A3E635';
      } else if (difficultyLevel == 'intermediate') {
        color = '#FB923C';
      } else {
        color = '#2563EB';
      }
      var taskObj: Task = {
        title: title,
        type: type,
        topic: topic,
        difficultyLevel: difficultyLevel,
        description: description,
        color: color,
      };
      this.tasks.push(taskObj);
    });
  }
}
