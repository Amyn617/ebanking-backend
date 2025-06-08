import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThemeService, Theme } from '../shared/services/theme.service';
import { GlobalSearchComponent } from '../shared/components/global-search/global-search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, GlobalSearchComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false;
  isAuthenticated: boolean = false;
  currentTheme: Theme = 'dark';

  constructor(
    public authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialiser le thème
    this.themeService.theme$.subscribe((theme) => {
      this.currentTheme = theme;
    });

    // Vérifier l'authentification
    this.checkAuthentication();
  }

  private checkAuthentication() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isAdmin = payload.scope?.includes('ROLE_ADMIN') || false;
        this.isAuthenticated = true;
      } catch (err) {
        console.error('Erreur lors du décodage du token:', err);
        this.isAuthenticated = false;
        this.isAdmin = false;
      }
    } else {
      this.isAuthenticated = false;
      this.isAdmin = false;
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.isAdmin = false;
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}
