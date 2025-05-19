import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
