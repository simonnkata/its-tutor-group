import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-compiler',
  standalone: true,
  imports: [],
  templateUrl: './compiler.component.html',
  styleUrl: './compiler.component.sass',
})
export class CompilerComponent {
  taskTitle: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.taskTitle = params['title'];
      console.log('Task title:', this.taskTitle);
    });
  }
}
