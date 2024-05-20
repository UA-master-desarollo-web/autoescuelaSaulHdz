import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (next, state): boolean | UrlTree => {
  const user = new AuthService().getLoggedInUser();
  if (user) {
    return true;
  } else {
    // Redirect to login page
    new Router().navigate(['/auth/login']);
    return false;
  }
};

/* export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this.authService.getLoggedInUser();
    if (user) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
 */
