import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(private http: HttpClient) {}

  getNotifications(headers: HttpHeaders): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3003/user/notification', { headers });
  }

  deleteNotification(notificationId: string, headers: HttpHeaders): Observable<any> {
    return this.http.delete<any>(`http://localhost:3003/user/notification/${notificationId}`, { headers });
  }
}
