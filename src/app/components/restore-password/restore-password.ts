import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';

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
          Swal.fire({
            title: 'Password Reset Successful',
            text: 'Your password has been reset successfully.',
            icon: 'success',
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true
          });
          this.passwordForm.reset();
        },
        error: (error) => {
          console.error('Error resetting password:', error);
          Swal.fire({
            title: 'Error',
            text: 'There was an error resetting your password. Please try again.',
            icon: 'error',
            showConfirmButton: true
          });
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
}
