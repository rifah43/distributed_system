import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import axios from 'axios'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../styles.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  authenticated = false;
  token: string | null = null;

  constructor(private formbuilder: FormBuilder, private router: Router) {}

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

    axios
      .post('http://localhost/user/register', user, {
        withCredentials: true,
      })
      .then((response) => {
        const successMessage = response.data.message;
        swal.fire('Success!', successMessage, 'success');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Registration error:', error);
        swal.fire('Error!', error.response.data?.message, 'error');
      });
  }
}
