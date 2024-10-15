import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.sass'
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirecttoLogin() {
    this.router.navigate(['/signup']);
  }
}

