import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor(private http: HttpClient, private router: Router) {}

  updateLogs(data: { [key: string]: any }, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const options = { headers: headers };
    return this.http
      .post<any>('http://localhost:5001/upload_logged_data', data, options)
      .pipe(
        catchError((error) => {
          console.error('Signup error', error);
          return error;
        })
      );
  }
  updateSolvedExercises(data: { [key: string]: any }, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const options = { headers: headers };
    return this.http
      .post<any>('http://localhost:5001/updateSolvedTasks', data, options)
      .pipe(
        catchError((error) => {
          console.error('Error updating solved tasks', error);
          return error;
        })
      );
  }
}

/*loggingService.updateLogs("data").subscribe(
  response => {
      console.log('Log update successful', response);
    },
    error => {
      console.error('Log update failed', error);
    }
  );
*/
