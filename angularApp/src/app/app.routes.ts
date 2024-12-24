import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { TasksOverviewComponent } from './tasks-overview/tasks-overview.component';
import { CompilerTaskComponent } from './tasks-form/compiler-task/compiler-task.component';
import { FlowchartTaskComponent } from './tasks-form/flowchart-task/flowchart-task.component';
import { FreeTextTaskComponent } from './tasks-form/free-text-task/free-text-task.component';
import { GapTaskComponent } from './tasks-form/gap-task/gap-task.component';
import { AppComponent } from './app.component';



export const routes: Routes = [
    { path: '', redirectTo: '/tasks-overview', pathMatch: 'full' },
    {
      path: '', 
      component: AppComponent,
      children: [
        { path: 'tasks-overview', component: TasksOverviewComponent },
        { path: 'tasks-form/compiler-task', component: CompilerTaskComponent },
        { path: 'tasks-form/flowchart-task', component: FlowchartTaskComponent },
        { path: 'tasks-form/free-text-task', component: FreeTextTaskComponent },
        { path: 'tasks-form/gap-task', component: GapTaskComponent },
      ],
    },
  ];
  


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}



