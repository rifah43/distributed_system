import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import axios from 'axios';

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

  constructor(private formbuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.jwtToken = localStorage.getItem('token');

    if (this.jwtToken) {
      this.form = this.formbuilder.group({
        content: [''],
        image: [''],
      });
    } else {
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

    const config = {
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
      },
    };

    axios
      .post('http://localhost/post', formData,config)
      .then((response) => {
        this.form.reset();
        swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        this.selectedFile = null;
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
