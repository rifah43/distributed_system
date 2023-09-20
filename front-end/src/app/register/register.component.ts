import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css','../../styles.css']
})
export class RegisterComponent implements OnInit{
  form:FormGroup
  authenticated = false;
  token: string | null = null;

  constructor(private formbuilder:FormBuilder, private http:HttpClient, private router:Router){

  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');

    if (this.token) {
      this.authenticated = true;
    }
    this.form = this.formbuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confpassword: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      swal.fire('Empty fields are not accepted!', 'Please fill out all fields.', 'error');
      return;
    }

    const user = this.form.getRawValue();

    if (user.password !== user.confpassword) {
      swal.fire('Passwords do not match!', 'Enter the same password.', 'error');
      return;
    }

    this.http.post("http://localhost:3001/user/register", user, {
      withCredentials: true
    })
    .subscribe(
      (response: any) => {
        const successMessage = response.message; 
        swal.fire('Success!', successMessage, 'success'); 
        this.router.navigate(['/login']); 
      },
      (err: any) => {
        console.error("Registration error:", err);
        swal.fire('Error!', err.error?.message, 'error');
      });
  }
}