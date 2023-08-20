import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  authenticated= false;

  constructor(private http:HttpClient, private router:Router){}

  ngOnInit():void{
    const token = localStorage.getItem('token')

    if(token){
      this.authenticated=true;
    }
  }
  logout():void{
    localStorage.clear();
    swal.fire({
      title: 'Success!',
      text: "Logout Successful",
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
    this.router.navigate(['/login']); 
  }
  }
