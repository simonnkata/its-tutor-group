import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gap',
  standalone: true,
  imports: [],
  templateUrl: './gap.component.html',
  styleUrl: './gap.component.sass',
})
export class GapComponent {
  taskTitle: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskTitle = params['title'];
      console.log('Task title:', this.taskTitle);
    });
  }
}
