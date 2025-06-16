import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../interfaces/user';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  
  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      password: [this.user.password, [Validators.required, Validators.minLength(8)]],
    })
  }
}
