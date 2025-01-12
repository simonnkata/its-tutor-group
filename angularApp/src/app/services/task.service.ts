import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private dataSubject = new Subject<any>();
  private baseUrl = 'http://127.0.0.1:5000'; // Flask-Backend-URL

  data$ = this.dataSubject.asObservable()

  send(data: any)
  {
    this.dataSubject.next(data)
  }

  constructor(private http: HttpClient) {}

  generateTaskTitle(topic: string, type: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.baseUrl}/generate-task-title`, { topic, type }, { headers });
  }
}



