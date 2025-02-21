import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { map, take, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return of(true);
        }
        
        // Convert Promise to Observable to handle errors properly
        return from(this.authService.refreshToken()).pipe(
          map(() => true),
          catchError(() => {
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: state.url }
            });
            return of(false);
          })
        );
      })
    );
  }
}
