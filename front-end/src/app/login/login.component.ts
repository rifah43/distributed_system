import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  authenticated = false;
  token: string | null = null;

  constructor(private formbuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
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

    axios
      .post('http://localhost/user/login', user, {
        withCredentials: true
      })
      .then((response) => {
        const successMessage = response.data.message;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("firstname", response.data.firstname);
        localStorage.setItem("lastname", response.data.lastname);
        localStorage.setItem("email", response.data.email);
        swal.fire({
          title: 'Success!',
          text: successMessage,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        this.router.navigate(['/']);
      })
      .catch((err) => {
        console.error("Login error:", err);
        swal.fire('Error!', err.response.data?.message, 'error');
      });
  }
}
