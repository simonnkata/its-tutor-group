import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const tutorGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const currentUsername = inject(AuthService).getCurrentUser();
  if (currentUsername === null) {
    const logIn = false;
    return logIn || router.navigateByUrl('/signup');
  } else {
    const logIn = true;
    return logIn || router.navigateByUrl('/signup');
  }
};
