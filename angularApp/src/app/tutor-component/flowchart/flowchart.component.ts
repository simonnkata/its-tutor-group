import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flowchart',
  standalone: true,
  imports: [],
  templateUrl: './flowchart.component.html',
  styleUrl: './flowchart.component.sass',
})
export class FlowchartComponent {
  taskTitle: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskTitle = params['title'];
      console.log('Task title:', this.taskTitle);
      
    });
  }
}
