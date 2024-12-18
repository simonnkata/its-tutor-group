import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../task-form/task-form.component';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass'
})
export class TaskListComponent {
  constructor(private dialog: MatDialog) {}

  openDialog(taskType: string): void {
    if (this.dialog.openDialogs.length > 0) {
      this.dialog.openDialogs[0].close(); // Close the open dialog
    }
    const dialogRef = this.dialog.open(TaskFormComponent, {
      data: {
        title: taskType + ' Form',
        message: 'This is a simple form for ' + taskType,
      },
      width: '80vw', // 80% of the viewport width
      height: '80vh', // 80% of the viewport height
      position: {
        top: '10vh', // Adjust to center vertically if needed
        left: '10vw', // Adjust to center horizontally if needed
    },

    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }
}
