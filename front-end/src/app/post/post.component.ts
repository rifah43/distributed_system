import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  form: FormGroup;
  authenticated = false;
  selectedFile: File | null = null;
  jwtToken: string | null = null;

  constructor(private formbuilder: FormBuilder, private http: HttpClient, private router:Router) {}

  ngOnInit(): void {
    this.jwtToken = localStorage.getItem('token')

    if(this.jwtToken){
      this.form = this.formbuilder.group({
        content: [''],
        image: [''],
      });
    }
    else{
      this.router.navigate(['/login']); 
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit(): void {
    if (!this.jwtToken) {
      swal.fire('Error!', 'Please log in to create a post.', 'error');
      return;
    }

    const content = this.form.get('content')?.value;
    const image = this.selectedFile;

    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image, image.name);
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.jwtToken}`
    });

    this.http.post<any>('http://localhost:9200/user/post', formData, {
      headers: headers
    }).subscribe(
      (response) => {
        this.form.reset();
        swal.fire({
          title: 'Success!',
          text: response.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.selectedFile = null;
        this.router.navigate(['/']); 
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
