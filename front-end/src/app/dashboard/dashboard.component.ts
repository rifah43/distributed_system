import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.authenticated = true;
      const fn = localStorage.getItem('firstname');
      const ln = localStorage.getItem('lastname');
      this.message = `${fn} ${ln}'s newsfeed`;
      this.fetchPosts();
    } else {
      this.router.navigate(['/login']);
    }
  }

  fetchPosts(): void {
    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };

    axios
      .get('http://localhost/post', config)
      .then((response) => {
        this.posts = response.data;
        console.log(this.posts);
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }
}