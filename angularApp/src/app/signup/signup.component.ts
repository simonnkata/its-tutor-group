import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class SignupComponent {
  studentSignupForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    disclaimerAccepted: [false, Validators.requiredTrue],
  });

  teacherSignupForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    disclaimerAccepted: [false, Validators.requiredTrue],
  });

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn: boolean = false;

  onSubmitRegisterStudent() {
    if (this.studentSignupForm.valid) {
      // Extract username and password from the form
      const username = this.studentSignupForm.value.username;
      const password = this.studentSignupForm.value.password;
      const disclaimerAccepted =
        this.studentSignupForm.value.disclaimerAccepted || false;
      // Check if username or password is undefined or null
      if (
        typeof username === 'string' &&
        typeof password === 'string' &&
        disclaimerAccepted
      ) {
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
          error: (error) => {
            // Handle signup error
            alert('Username already existed.');
            console.error('Signup failed: Username already existed.', error);
          },
        });
      } else {
        // Handle the case where username or password is not a string
        console.error('Username or password is missing or invalid.');
      }
    }
  }

  onSubmitRegisterTeacher() {
    if (this.teacherSignupForm.valid) {
      // Extract username and password from the form
      const username = this.teacherSignupForm.value.username || '';
      const password = this.teacherSignupForm.value.password || '';
      const email = this.teacherSignupForm.value.email || '';
      const firstName = this.teacherSignupForm.value.firstname || '';
      const lastName = this.teacherSignupForm.value.lastname || '';
      const disclaimerAccepted =
        this.teacherSignupForm.value.disclaimerAccepted || false;
      // Check if username or password is undefined or null
      if (
        typeof username === 'string' &&
        typeof password === 'string' &&
        disclaimerAccepted
      ) {
        this.authService
          .teacherSignup(username, email, firstName, lastName, password)
          .subscribe({
            next: (user) => {
              if (user && user.token) {
                // Handle successful signup
                console.log('Signup successful');
                // Redirect the user
                //window.location.reload();
                this.router.navigateByUrl('/teacher/tasks-overview');
              } else {
                console.error('Signup successful, but no token received');
              }
            },
            error: (error) => {
              // Handle signup error
              alert('Username already existed.');
              console.error('Signup failed: Username already existed.', error);
            },
          });
      } else {
        // Handle the case where username or password is not a string
        console.error('Username or password is missing or invalid.');
      }
    }
  }

  onSubmitLoginStudent() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      console.log([username, password]);
      if (typeof username === 'string' && typeof password === 'string') {
        this.authService.login(username, password).subscribe({
          next: (user) => {
            if (user && user.token) {
              console.log('Login successful.');
              window.location.reload();
              this.router.navigateByUrl('/tutor');
            } else {
              console.error('Login successful, but no token received');
            }
          },
          error: (err) => {
            alert('Wrong username or password.');
            console.error('Login failed', err);
          },
        });
      }
    }
  }

  onSubmitLoginTeacher() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;
      if (typeof username === 'string' && typeof password === 'string') {
        this.authService.teacherLogin(username, password).subscribe({
          next: (user) => {
            console.log(user);
            if (user && user.token) {
              console.log('Login successful.');
              this.router.navigateByUrl('teacher/tasks-overview');
            } else {
              console.error('Login successful, but no token received');
            }
          },
          error: (err) => {
            alert('Wrong username or password.');
            console.error('Login failed', err);
          },
        });
      }
    }
  }

  logOut() {
    this.authService.logout();
  }

  closePopup(popup: string) {
    const registerElement = document.getElementById(popup);
    if (registerElement != null) {
      registerElement.style.display = 'none';
    }
  }

  openPopup(popup: string) {
    const registerElement = document.getElementById(popup);
    if (registerElement != null) {
      registerElement.style.display = 'flex';
    }
  }

  openStudentRegister() {
    this.closePopup('studentPopup');
    this.openPopup('studentRegisterPopup');
  }

  openTeacherRegister() {
    this.closePopup('teacherPopup');
    this.openPopup('teacherRegisterPopup');
  }

  returnToTeacherLogin() {
    this.closePopup('teacherRegisterPopup');
    this.openPopup('teacherPopup');
  }

  returnToStudentLogin() {
    this.closePopup('studentRegisterPopup');
    this.openPopup('studentPopup');
  }
}
