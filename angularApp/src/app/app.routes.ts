import { Routes } from '@angular/router';
import { TutorComponentComponent } from './tutor-component/tutor-component.component'; 
import { SignupComponent } from './signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { tutorGuard } from './guards/tutorGuard';
import { signupGuard } from './guards/signupGuard';
import { TaskListComponent } from './task-list/task-list.component';

export const routes: Routes = [
    {path: '',   redirectTo: '/welcome', pathMatch: 'full'},
    {path: 'tutor',
    component: TutorComponentComponent,
    canActivate: [tutorGuard],
    },
    {path: 'signup', component: SignupComponent,
        canActivate: [signupGuard],
     },
    {path: 'welcome', component: WelcomeComponent },
    {path: 'tasks', component: TaskListComponent}
];