import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css','../../styles.css']
})
export class LoginComponent implements OnInit{
  form:FormGroup
  authenticated = false;
  token: string | null = null;

  constructor(private formbuilder:FormBuilder, private http:HttpClient, private router:Router){}

  ngOnInit():void{
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.authenticated = true;
    }
    this.form = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      swal.fire('Error!', 'Please fill out all fields.', 'error');
      return;
    }

    const user = this.form.getRawValue();

    this.http.post("http://localhost:9200/user/login", user, {
      withCredentials: true
    })
    .subscribe(
      (response: any) => {
        console.log(response);
        const successMessage = response.message; 
        localStorage.setItem("token", response.token);
        localStorage.setItem("firstname", response.firstname);
        localStorage.setItem("lastname", response.lastname);
        localStorage.setItem("email", response.email);
        swal.fire({
          title: 'Success!',
          text: successMessage,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/']); 
      },
      (err: any) => {
        console.error("Login error:", err);
        swal.fire('Error!', err.error?.message, 'error');
      });
    }
}