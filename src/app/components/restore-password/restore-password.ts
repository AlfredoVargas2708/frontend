import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-restore-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restore-password.html',
  styleUrl: './restore-password.scss'
})
export class RestorePassword {
  passwordForm: FormGroup
  
  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      email: [''],
      password: [''],
      confirmPassword: ['']
    });
  }
}
