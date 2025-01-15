import { Routes } from '@angular/router';
import { TutorComponentComponent } from './tutor-component/tutor-component.component';
import { SignupComponent } from './signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { tutorGuard } from './guards/tutorGuard';
import { signupGuard } from './guards/signupGuard';
import { TasksOverviewComponent } from './teacher/tasks-overview/tasks-overview.component';
import { CompilerTaskComponent } from './teacher/tasks-form/compiler-task/compiler-task.component';
import { FlowchartTaskComponent } from './teacher/tasks-form/flowchart-task/flowchart-task.component';
import { FreeTextTaskComponent } from './teacher/tasks-form/free-text-task/free-text-task.component';
import { GapTaskComponent } from './teacher/tasks-form/gap-task/gap-task.component';
import { EditCompilerTaskComponent } from './teacher/tasks-form/compiler-task/edit-compiler-task/edit-compiler-task.component';
import { TeacherComponent } from './teacher/teacher.component';
import { CompilerComponent } from './tutor-component/compiler/compiler.component';
import { FlowchartComponent } from './tutor-component/flowchart/flowchart.component';
import { FreetextComponent } from './tutor-component/freetext/freetext.component';
import { GapComponent } from './tutor-component/gap/gap.component';

export const routes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  {
    path: 'tutor',
    component: TutorComponentComponent,
    canActivate: [tutorGuard],
    children: [
      { path: 'compiler', component: CompilerComponent },
      { path: 'compiler/:title/edit', component: CompilerComponent },
      { path: 'flowchart', component: FlowchartComponent },
      { path: 'freetext', component: FreetextComponent },
      { path: 'gap', component: GapComponent },
    ],
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [signupGuard],
  },
  { path: 'welcome', component: WelcomeComponent },

  {
    path: 'teacher',
    component: TeacherComponent,
    children: [
      { path: 'tasks-overview', component: TasksOverviewComponent },
      { path: 'compiler-task', component: CompilerTaskComponent },
      {
        path: 'compiler-task/:title/edit',
        component: EditCompilerTaskComponent,
      },
      { path: 'flowchart-task', component: FlowchartTaskComponent },
      { path: 'free-text-task', component: FreeTextTaskComponent },
      { path: 'gap-task', component: GapTaskComponent },
    ],
  },
];
