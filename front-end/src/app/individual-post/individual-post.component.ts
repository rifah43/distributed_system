import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-individual-post',
  templateUrl: './individual-post.component.html',
  styleUrls: ['./individual-post.component.css']
})
export class IndividualPostComponent implements OnInit {
  postId: string | null = null;
  post: any;
  token: string | null = null;

  constructor(private route: ActivatedRoute) {}

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
    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };

    axios
      .get(`http://localhost/post/${this.postId}`, config)
      .then((response) => {
        this.post = response.data;
      })
      .catch((error) => {
        console.error('Error fetching post details:', error);
      });
  }
}
