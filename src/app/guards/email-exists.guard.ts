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
export class EmailExistsGuard implements CanActivate {
  constructor(private usersService: UsersService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const email = route.params['email'] || route.queryParams['email'];
    if (!email) {
      return of(this.router.createUrlTree(['/error'])); // o redirige a login u otro
    }

    return this.usersService.checkEmailExists(email).pipe(
      map((exists: boolean) => {
        if (exists) {
          return true;
        } else {
          return this.router.createUrlTree(['/email-not-found']);
        }
      }),
      catchError(() => of(this.router.createUrlTree(['/error'])))
    );
  }
}
