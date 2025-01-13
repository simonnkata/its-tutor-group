import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private dataSubject = new Subject<any>();
  private baseUrl = 'http://127.0.0.1:5000'; // Flask-Backend-URL

  data$ = this.dataSubject.asObservable();

  send(data: any) {
    this.dataSubject.next(data);
  }

  constructor(private http: HttpClient) {}

  generateTaskTitle(topic: string, type: string): Observable<any> {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const options = { headers: headers };
    return this.http.post(
      `${this.baseUrl}/generateTaskTitle`,
      { topic, type },
      options
    );
  }

  createTask(task: any): Observable<any> {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(`${this.baseUrl}/task`, task, { headers });
  }

  getTasks(): Observable<any> {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.baseUrl}/task`, { headers });
  }
}
