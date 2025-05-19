import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly API_URL = 'http://localhost:8085';
  private isBrowser: boolean;

  isAuthenticated: boolean = false;
  roles: string[] = [];
  username: string = '';
  accessToken: string = '';

  private document: Document;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(DOCUMENT) document: Document
  ) {
    this.document = document;
    // Check if window is defined to determine if we're in a browser environment
    this.isBrowser = typeof window !== 'undefined';
    this.loadAuthStateFromStorage();
  }

  private loadAuthStateFromStorage() {
    // Skip localStorage usage during server-side rendering
    if (!this.isBrowser) {
      return;
    }

    try {
      const savedToken = localStorage.getItem(this.TOKEN_KEY);
      const savedUserData = localStorage.getItem(this.USER_DATA_KEY);

      if (savedToken && savedUserData) {
        const userData = JSON.parse(savedUserData);
        this.isAuthenticated = true;
        this.accessToken = savedToken;
        this.username = userData.username;
        this.roles = userData.roles || [];
      }
    } catch (e) {
      console.error('Error loading auth state:', e);
      this.clearAuthState();
    }
  }

  private clearAuthState() {
    this.isAuthenticated = false;
    this.accessToken = '';
    this.username = '';
    this.roles = [];

    // Only try to clear localStorage in browser environment
    if (this.isBrowser) {
      try {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_DATA_KEY);
      } catch (e) {
        console.error('Error clearing auth state from localStorage:', e);
      }
    }
  }

  public login(username: string, password: string): Observable<any> {
    const options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    };

    const params = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(`${this.API_URL}/auth/login`, params, options).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  loadProfile(data: any) {
    if (!data || !data['access_token']) {
      return;
    }

    this.isAuthenticated = true;
    this.accessToken = data['access_token'];
    this.username = data['username'] || '';
    this.roles = data['roles'] || [];

    // Save authentication state to localStorage (only in browser)
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.TOKEN_KEY, this.accessToken);
        localStorage.setItem(
          this.USER_DATA_KEY,
          JSON.stringify({
            username: this.username,
            roles: this.roles,
          })
        );
      } catch (e) {
        console.error('Error saving auth state to localStorage:', e);
      }
    }
  }

  getAuthToken(): string {
    return this.accessToken;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  logout() {
    this.clearAuthState();
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}
