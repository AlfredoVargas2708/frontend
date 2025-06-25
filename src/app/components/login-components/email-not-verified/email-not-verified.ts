import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-email-not-verified',
  imports: [RouterModule],
  templateUrl: './email-not-verified.html',
  styleUrl: './email-not-verified.scss'
})
export class EmailNotVerified {
  constructor(private userService: UsersService, private route: ActivatedRoute) { 
    // Aquí puedes inicializar cualquier dato necesario
  }

  resendVerificationEmail() {
    this.route.params.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.userService.confirmEmail(email).subscribe({
          next: (response) => {
            console.log('Verification email resent successfully:', response);
          },
          error: (error) => {
            console.error('Error resending verification email:', error);
          }
        });
      } else {
        console.error('Email parameter is missing');
      }
    })
  }
}
