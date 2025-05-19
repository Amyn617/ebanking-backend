import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip adding token during server-side rendering
    if (isPlatformServer(this.platformId)) {
      return next.handle(request);
    }

    // Skip authentication header for login request
    if (request.url.includes('/auth/login')) {
      return next.handle(request);
    }

    const token = this.authService.getAuthToken();
    if (token) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(authReq);
    }

    return next.handle(request);
  }
}
