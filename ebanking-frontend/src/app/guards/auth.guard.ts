import { Injectable, Inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Skip authentication check if we're in server environment
    if (typeof window === 'undefined') {
      return true;
    }

    if (this.authService.isAuthenticated) {
      return true;
    }

    // Store the attempted URL for redirection after login
    const url = state.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
    return false;
  }
}
