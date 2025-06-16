import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../interfaces/user';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { EmailsService } from '../../services/emails.service';

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

  userForm: FormGroup

  @ViewChild('forgotEmailInput') forgotEmailInput!: ElementRef;
  
  constructor(private fb: FormBuilder, private emailService: EmailsService) {
    this.userForm = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, [Validators.required, Validators.minLength(8)]],
    })
  }

  sendEmailPasswordReset() {
    const email = this.forgotEmailInput.nativeElement.value;
    this.emailService.sendPasswordResetEmail(email).subscribe({
      next: (response) => {
        console.log('Password reset email sent successfully:', response);
      },
      error: (error) => {
        console.error('Error sending password reset email:', error);
      }
    });
  }
}
