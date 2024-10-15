import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class SignupComponent {
  signupForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    disclaimerAccepted: [false, Validators.requiredTrue]
  });

  constructor(
    private fb: FormBuilder, 
    public authService: AuthService,
    private router: Router,
    ) {}
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  
    isLoggedIn: boolean = false;

  onSubmitRegister() {
    if (this.signupForm.valid) {
      // Extract username and password from the form
      const username = this.signupForm.value.username;
      const password = this.signupForm.value.password;
  
      // Check if username or password is undefined or null
      if (typeof username === 'string' && typeof password === 'string') {
        this.authService.signup(username, password).subscribe({
          next: (user) => {
            if (user && user.token) {
            // Handle successful signup
            console.log('Signup successful');
            // Redirect the user
            window.location.reload();
            this.router.navigateByUrl('/tutor');
            } else {
              console.error('Signup successful, but no token received');
            }
          },
          error: error => {
            // Handle signup error
            alert('Username already existed.')
            console.error('Signup failed: Username already existed.', error);
          }
        });
      } else {
        // Handle the case where username or password is not a string
        console.error('Username or password is missing or invalid.');
      }
    }
  }


onSubmitLogin() {
  if (this.loginForm.valid) {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    if (typeof username === 'string' && typeof password === 'string') {
      this.authService.login(username, password).subscribe({
        next: (user) => {
          if (user && user.token) {
            console.log("Login successful.");
            window.location.reload();
            this.router.navigateByUrl('/tutor'); 
          } else {
            console.error('Login successful, but no token received');
          }
        },
        error: (err) => {
          alert('Wrong username or password.')
          console.error('Login failed', err);
        }
      });
    }
  }
}

logOut() {
   this.authService.logout()
}



}