import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const signupGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const  currentUsername = inject(AuthService).getCurrentUser();
  if (currentUsername !== null) {
    const logIn = false
    return logIn || router.navigate(['tutor']);
  }
  else {
    const logIn= true
    return logIn || router.navigate(['welcome']);
  }
}