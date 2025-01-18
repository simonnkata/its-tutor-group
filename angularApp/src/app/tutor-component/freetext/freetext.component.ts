import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-freetext',
  standalone: true,
  imports: [],
  templateUrl: './freetext.component.html',
  styleUrl: './freetext.component.sass',
})
export class FreetextComponent {
  taskTitle: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskTitle = params['title'];
      console.log('Task title:', this.taskTitle);
    });
  }
}
