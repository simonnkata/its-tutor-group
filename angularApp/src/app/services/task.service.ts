import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';


interface Task {
  title: string;
  type: string;
  topic: string;
  difficultyLevel: string;
  description?: string;
  color?: string;
}

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

  constructor(private httpClient: HttpClient) {}

  generateTaskTitle(topic: string, type: string): Observable<any> {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const options = { headers: headers };
    return this.httpClient.post(
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
    return this.httpClient.post(`${this.baseUrl}/task`, task, { headers });
  }

  updateTask(task: any): Observable<any> {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.put(`${this.baseUrl}/task/${task.title}`, task, { headers });
  }

  getTasks(): Observable<any> {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.get(`${this.baseUrl}/task`, { headers });
  }

  deleteTask(title: string) {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.delete(`${this.baseUrl}/task/${title}`, { headers })
  }

  getTask(title: string) {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.httpClient.get<any>(`${this.baseUrl}/task/${title}`, { headers });
  }



  
    getTaskByTitle(title: string) {
      // Beispiel-API-Endpunkt
      return this.httpClient.get(`/api/tasks?title=${title}`);
    }
  
  
  
  

  getFeedback(title: string, userAnswer: string, userOutput: string): Observable<any>  {
    const StoredUser = localStorage.getItem('currentUser');
    const UserInfoJson = StoredUser ? JSON.parse(StoredUser) : null;
    const token = UserInfoJson.token;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const options = { headers: headers };
    return this.httpClient.post(
      `${this.baseUrl}/feedback/${title}`,
      { userAnswer, userOutput },
      options
    );
  }
}
