import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-flowchart',
  standalone: true,
  imports: [NgIf],
  templateUrl: './flowchart.component.html',
  styleUrls: ['./flowchart.component.sass'],
})
export class FlowchartComponent implements OnInit {
  taskTitle: string | null = null; // Speichert den Titel der Aufgabe aus den Query-Parametern
  taskDetails: any = {}; // Speichert die Details der Aufgabe

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit(): void {
    // Lese den Query-Parameter 'title' aus der URL
    this.route.queryParams.subscribe((params) => {
      this.taskTitle = params['title'];
      console.log('Task title:', this.taskTitle);

      // Wenn der Titel vorhanden ist, hole die Details der Aufgabe
      if (this.taskTitle) {
        this.getTaskDetails();
      }
    });
  }

  // Funktion, um die Aufgabe basierend auf dem Titel zu laden
  getTaskDetails(): void {
    if (this.taskTitle) {
      this.taskService.getTaskByTitle(this.taskTitle).subscribe({
        next: (response: any) => {
          console.log('Task details:', response);
          this.taskDetails = response; // Speichert die erhaltenen Details
        },
        error: (error: any) => {
          console.error('Error fetching task details:', error);
        },
      });
    }
  }
}
