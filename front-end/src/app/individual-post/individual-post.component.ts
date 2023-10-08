import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-individual-post',
  templateUrl: './individual-post.component.html',
  styleUrls: ['./individual-post.component.css']
})
export class IndividualPostComponent implements OnInit {
  postId: string | null = null;
  post: any; 
  token: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.route.paramMap.subscribe(params => {
        this.postId = params.get('postId');
        if (this.postId) {
          this.fetchPostDetails();
        }
      });
    }
  }

  fetchPostDetails() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.get<any>(`http://post:3000/post/${this.postId}`, { headers: headers }).subscribe(
      (post) => {
        this.post = post;
      },
      (error) => {
        console.error('Error fetching post details:', error);
      }
    );
  }
}
