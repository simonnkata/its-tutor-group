import { Component, NgModule, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoggingService } from '../services/log.service';
import { AuthService } from '../services/auth.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, NonNullableFormBuilder } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { NgIf, NgFor, NgStyle } from '@angular/common';
interface Experience {
  name: string;
}
@Component({
  selector: 'app-tutor-component',
  standalone: true,
  imports: [RouterOutlet, DropdownModule, FormsModule, NgIf, NgFor, NgStyle],
  templateUrl: './tutor-component.component.html',
  styleUrl: './tutor-component.component.sass',
})
export class TutorComponentComponent implements OnInit {
  experienceLevel: Experience[] = [
    { name: 'Beginner' },
    { name: 'Advanced' },
    { name: 'Expert' },
  ];
  currentUser = localStorage.getItem('currentUser');
  currentUserInfo = this.currentUser ? JSON.parse(this.currentUser) : null;
  currentUsername: String = this.currentUserInfo.username;
  selectedExperienceLevel: Experience = this.experienceLevel[0];
  tasks: any;

  constructor(
    private loggingService: LoggingService,
    private authservice: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((response: any) => {
      this.tasks = response.data.tasks;
      console.log('Tasks:', this.tasks);
    });

    (window as any).loggingService = this.loggingService;
    (window as any).logHelperFunction = function (
      data: { [key: string]: any },
      token: string
    ) {
      this.loggingService.updateLogs(data, token).subscribe(
        (response: any) => {
          console.log('Log update successful', response);
        },
        (error: any) => {
          console.log('Log update failed', error);
          console.error('Log update failed', error);
        }
      );
    };
    (window as any).updateSolvedExercisesList = function (
      data: { [key: string]: any },
      token: string
    ) {
      this.loggingService.updateSolvedExercises(data, token).subscribe(
        (response: any) => {
          console.log('Updated solved exercise list successfully', response);
        },
        (error: any) => {
          console.error('Error updating exercise list', error);
        }
      );
    };
  }
  logout(): void {
    this.authservice.logout();
  }
  onDifficultyChange() {
    console.log('Selected Difficulty:', this.selectedExperienceLevel);
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const experienceLevel = String(this.selectedExperienceLevel);
    const username = String(UserInfoJson.username);
    const token = String(UserInfoJson.token);
    this.authservice
      .changeExperienceLevel(username, token, experienceLevel)
      .subscribe();
  }

  openTask(task: any): void {
    const type = task.type;
    this.router.navigate([`/tutor/${type}`], {
      queryParams: { title: task.title },
      state: { task },
    });
    console.log('Open task:', task);
  }
}
