import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../interfaces/user';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EmailsService } from '../../services/emails.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent {
  user: User = {
    email: '',
    password: '',
    admin: false
  }

  isFlipped: boolean = false;

  userForm: FormGroup

  @ViewChild('forgotEmailInput') forgotEmailInput!: ElementRef;
  
  constructor(private fb: FormBuilder, private emailService: EmailsService, private userService: UsersService, private router: Router) {
    this.userForm = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, [Validators.required, Validators.minLength(8)]],
    })
  }

  sendEmailPasswordReset() {
    const email = this.forgotEmailInput.nativeElement.value;
    this.emailService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        Swal.fire({
          title: 'Email Sent',
          text: 'Please check your email for password reset instructions.',
          icon: 'success',
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true
        });
      },
      error: (error) => {
        console.error('Error sending email:', error);
        Swal.fire({
          title: 'Error',
          text: 'There was an error sending the email. Please try again.',
          icon: 'error',
          showConfirmButton: true
        });
      }
    });
  }

  login() {
    if(this.userForm.valid) {
      const userData = this.userForm.value;
      this.userService.login(userData).subscribe({
        next: () => {
          Swal.fire({
            title: 'Login Successful',
            text: 'Welcome back!',
            icon: 'success',
            toast: true,
            position: 'top-end',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/admin']);
          })
        },
        error: (error) => {
          console.error('Login error:', error);
          Swal.fire({
            title: 'Login Failed',
            text: 'Invalid email or password. Please try again.',
            icon: 'error',
            showConfirmButton: true
          });
        }
      })
    }
  }

  changeView() {
    this.isFlipped = !this.isFlipped;
  }
}
