import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isAdmin = payload.scope === 'ROLE_ADMIN';

    if (!isAdmin) {
      router.navigate(['/accounts']);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to decode token:', err);
    router.navigate(['/login']);
    return false;
  }
};
