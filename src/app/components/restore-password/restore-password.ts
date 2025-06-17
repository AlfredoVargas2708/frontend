import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-restore-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restore-password.html',
  styleUrl: './restore-password.scss'
})
export class RestorePassword {
  passwordForm: FormGroup
  
  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.passwordForm = this.fb.group({
      email: [''],
      password: [''],
      confirmPassword: ['']
    });
  }

  resetPassword() {
    if (this.passwordForm.valid) {
      this.usersService.resetPassword(this.passwordForm.value).subscribe({
        next: (res) => {
          console.log('Password reset successful', res);
        },
        error: (error) => {
          console.error('Error resetting password', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
