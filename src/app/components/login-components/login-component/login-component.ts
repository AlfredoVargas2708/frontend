import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../../interfaces/user';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailsService } from '../../../services/emails.service';
import { UsersService } from '../../../services/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent implements AfterViewInit {
  user: User = {
    email: '',
    password: '',
    admin: false
  }

  isFlipped: boolean = false;

  userForm: FormGroup
  signUpForm: FormGroup

  @ViewChild('forgotEmailInput') forgotEmailInput!: ElementRef;
  @ViewChild('emailLogin') emailLogin!: ElementRef;
  @ViewChild('emailSignUp') emailSignUp!: ElementRef;

  constructor(private fb: FormBuilder, private emailService: EmailsService, private userService: UsersService, private router: Router) {
    this.userForm = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, [Validators.required, Validators.minLength(8)]],
    })
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['Employee', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emailLogin.nativeElement.focus();
    }, 1000)
  }

  sendEmailPasswordReset() {
    const email = this.forgotEmailInput.nativeElement.value;
    this.emailService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        Swal.fire({
          title: 'Correo Enviado',
          text: 'Por favor, revisa tu correo electrónico para obtener instrucciones sobre cómo restablecer tu contraseña.',
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
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      this.userService.login(userData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Login Completado',
            text: '¡Bienvenido de nuevo!',
            icon: 'success',
            toast: true,
            position: 'top-end',
            timer: 1000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            response.user.is_admin === true ? this.router.navigate(['/admin']) : this.router.navigate(['/employee']);
          })
        },
        error: (error) => {
          console.error('Login error:', error);
          Swal.fire({
            title: 'Login Fallido',
            text: 'Correo electrónico o contraseña inválidos. Por favor, inténtalo de nuevo.',
            icon: 'error',
            showConfirmButton: true
          });
        }
      })
    }
  }

  changeView() {
    this.isFlipped = !this.isFlipped;
    if (this.isFlipped) {
      this.signUpForm.reset();
      setTimeout(() => {
        this.emailSignUp.nativeElement.focus();
      }, 1000);
    } else {
      this.userForm.reset();
      setTimeout(() => {
        this.emailLogin.nativeElement.focus();
      }, 1000);
    }
  }

  signUp() {
    if (this.signUpForm.valid) {
      const signUpData = this.signUpForm.value;
      this.userService.signUp(signUpData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Registro Exitoso',
            text: '¡Te has registrado con éxito!. Hemos enviado un correo electrónico de confirmación.',
            icon: 'success',
            toast: true,
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/login']);
          })
        }
      })
    }
  }
}
