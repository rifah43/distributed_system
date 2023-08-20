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

    if (!content && !image) {
      swal.fire('Error!', 'Please provide either post content or an image.', 'error');
      return;
    }

    const post = this.form.getRawValue();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.jwtToken}`
    });

    if (image) {
      post.image = this.selectedFile;

      this.http.post<any>('http://localhost:9000/user/post', post, {
        headers: headers
      }).subscribe(
        (response) => {
          console.log(response);
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
    } else {
      console.log(headers);
      this.http.post('http://localhost:9000/user/post', post, {
        headers: headers
      }).subscribe(
        (response: any) => {
          swal.fire({
            title: 'Success!',
            text: response.message,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          this.form.reset();
          this.router.navigate(['/']); 
        }
      );
    }
  }
}