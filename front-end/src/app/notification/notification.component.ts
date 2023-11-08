import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit {
  notifications: any[] = [];
  jwtToken: string | null = null;
  constructor(private router: Router, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.jwtToken = localStorage.getItem('token')
    console.log(this.jwtToken,"hihi");
    
    if(this.jwtToken){
      this.fetchNotifications();
    }
  }

  fetchNotifications() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.jwtToken}`
    });
    console.log(headers);
    

    this.notificationService.getNotifications(headers).subscribe(
      (notifications: any) => {
        this.notifications = notifications;
        console.log(this.notifications);
      },
      (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  deleteNotification(notificationId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.jwtToken}`
    });

    this.notificationService.deleteNotification(notificationId, headers).subscribe(
      () => { 
        this.fetchNotifications(); 
      },
      (error: any) => {
        console.error('Error deleting notification:', error);
      }
    );
  }
}
