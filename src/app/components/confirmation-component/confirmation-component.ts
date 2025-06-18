import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-confirmation-component',
  imports: [RouterModule],
  templateUrl: './confirmation-component.html',
  styleUrl: './confirmation-component.scss'
})
export class ConfirmationComponent implements AfterViewInit {
  
  constructor(private userService: UsersService, private route: ActivatedRoute) { }

  email: string = '';

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.email = params['email'];
      this.userService.confirmEmail(this.email).subscribe({
        next: (response) => {
          console.log('Email confirmed successfully:', response);
        },
        error: (error) => {
          console.error('Error confirming email:', error);
        }
      });
    });
  }
}
