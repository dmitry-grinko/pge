import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  // TODO: fix "any"
  intercept(request: HttpRequest<any>, next: HttpHandler): any {
    console.log("intercepting request", request);
    
    return this.authService.accessToken$.pipe(
      take(1),
      switchMap(accessToken => {
        return this.authService.idToken$.pipe(
          take(1),
          switchMap(idToken => {
            if (accessToken) {
              request = this.addTokens(request, accessToken, idToken);
            }

            return next.handle(request).pipe(
              catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                  return this.handle401Error(request, next);
                }
                return throwError(() => error);
              })
            );
          })
        );
      })
    );
  }

  private addTokens(request: HttpRequest<any>, accessToken: string, idToken: string | null) {

    console.log("accessToken", accessToken);
    console.log("idToken", idToken);

    const headers: { [key: string]: string } = {
      Authorization: `Bearer ${accessToken}`
    };

    if (idToken) {
      headers['x-id-token'] = idToken;
    }

    return request.clone({
      setHeaders: headers
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().then(() => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(true);
        return next.handle(request);
      }).catch(error => {
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => error);
      });
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(() => {
        return next.handle(request);
      })
    );
  }
}
