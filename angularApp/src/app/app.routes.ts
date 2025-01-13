import { Routes } from '@angular/router';
import { TutorComponentComponent } from './tutor-component/tutor-component.component';
import { SignupComponent } from './signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { tutorGuard } from './guards/tutorGuard';
import { signupGuard } from './guards/signupGuard';
import { TasksOverviewComponent } from './tasks-overview/tasks-overview.component';
import { CompilerTaskComponent } from './tasks-form/compiler-task/compiler-task.component';
import { FlowchartTaskComponent } from './tasks-form/flowchart-task/flowchart-task.component';
import { FreeTextTaskComponent } from './tasks-form/free-text-task/free-text-task.component';
import { GapTaskComponent } from './tasks-form/gap-task/gap-task.component';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  {
    path: 'tutor',
    component: TutorComponentComponent,
    canActivate: [tutorGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [signupGuard],
  },
  { path: 'welcome', component: WelcomeComponent },

  { path: 'tasks-overview', component: TasksOverviewComponent },
  { path: 'compiler-task', component: CompilerTaskComponent },
  { path: 'flowchart-task', component: FlowchartTaskComponent },
  { path: 'free-text-task', component: FreeTextTaskComponent },
  { path: 'gap-task', component: GapTaskComponent },
];
