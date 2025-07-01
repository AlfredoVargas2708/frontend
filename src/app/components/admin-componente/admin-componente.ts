import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-componente',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule],
  templateUrl: './admin-componente.html',
  styleUrl: './admin-componente.scss'
})
export class AdminComponente {
  isSidebarOpen = false;

  constructor(
    private router: Router
  ) {}

logout() {
  this.router.navigate(['/login']); // Redirige al login
}

isActive(route: string): boolean {
  return this.router.isActive(route, true);
}
}
