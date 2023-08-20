import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  message: string = "";
  token: string | null = null;
  authenticated = false;
  posts: any[] = [];

  constructor(private http: HttpClient, private router:Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.authenticated = true;
      const fn = localStorage.getItem('firstname');
      const ln = localStorage.getItem('lastname');
      this.message = `${fn} ${ln}'s newsfeed`;
      this.fetchPosts();
    }
    else{
      this.router.navigate(['/login']); 
    }
  }

  fetchPosts(): void {
    const headers= new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.get<any>('http://localhost:9000/user/post', { headers: headers }).subscribe(
      (posts) => {
        this.posts = posts;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
