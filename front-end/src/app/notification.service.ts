import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private baseURL = 'http://localhost/notification';

  constructor() {}

  getNotifications(headers: any): Observable<any[]> {
    const config = {
      headers: headers,
    };
    console.log(config);
    
    return new Observable<any[]>((observer) => {
      axios
        .get(this.baseURL,config)
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

  deleteNotification(notificationId: string, headers: any): Observable<any> {
    const config = {
      headers: headers,
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
}
