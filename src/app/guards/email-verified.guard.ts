import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UsersService } from '../services/users.service'; // Servicio que conecta al backend

@Injectable({
  providedIn: 'root'
})
export class EmailVerifiedGuard implements CanActivate {
  constructor(private usersService: UsersService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const email = route.params['email'] || route.queryParams['email'];
    if (!email) {
      return of(this.router.createUrlTree(['/error'])); // o redirige a login u otro
    }

    return this.usersService.checkEmailVerified(email).pipe(
      map((verified: boolean) => {
        if (verified) {
          return true;
        } else {
          return this.router.createUrlTree(['/email-not-verified']);
        }
      }),
      catchError(() => of(this.router.createUrlTree(['/error'])))
    );
  }
}
