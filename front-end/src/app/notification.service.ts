import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios'; // Update import
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseURL = 'http://localhost/notification';

  constructor() {}

  getNotifications(headers: HttpHeaders): Observable<any[]> {
    const config: AxiosRequestConfig = {
      headers: this.convertHeaders(headers),
    };

    return new Observable<any[]>((observer) => {
      axios
        .get(this.baseURL, config)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  deleteNotification(notificationId: string, headers: HttpHeaders): Observable<any> {
    const config: AxiosRequestConfig = {
      headers: this.convertHeaders(headers),
    };

    return new Observable<any>((observer) => {
      axios
        .delete(`${this.baseURL}/${notificationId}`, config)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  private convertHeaders(headers: HttpHeaders): Record<string, string> {
    const convertedHeaders: Record<string, string> = {};
    headers.keys().forEach((key) => {
      convertedHeaders[key] = headers.get(key) || '';
    });
    return convertedHeaders;
  }
}
