import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse, HttpEvent, HttpHeaders } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError, switchMap, throwError, Observable, from } from "rxjs";
import { environment } from "../../../environments/environment";

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  console.log('Auth Interceptor');

  const authService = inject(AuthService);
  const modifiedReq = addApiUrl(req);

  if (isAuthRequest(modifiedReq)) {
    return next(modifiedReq);
  }

  return handleAuthenticatedRequest(modifiedReq, next, authService);
};

function addApiUrl(req: HttpRequest<unknown>): HttpRequest<unknown> {
  console.log('addApiUrl', req.url);
  if (!req.url.startsWith('http')) {
    const url = `${environment.apiUrl}${req.url}`;
    console.log('url', url);
    return req.clone({ url });
  }
  return req;
}

function isAuthRequest(req: HttpRequest<unknown>): boolean {
  const isAuth = req.url.includes('/auth/');
  console.log('isAuth', isAuth);
  return isAuth;
}

function handleAuthenticatedRequest(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  const token = authService.getAccessToken();
  if (!token) {
    console.log('No token available');
    return next(req);
  }

  console.log('access token', token);

  const authenticatedReq = req.clone({ 
    headers: createAuthHeaders(req.url, token, authService, req.headers) 
  });

  return next(authenticatedReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handleTokenRefresh(authenticatedReq, next, authService);
      }
      return throwError(() => error);
    })
  );
}

function handleTokenRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  return from(authService.refreshToken()).pipe(
    switchMap(() => {
      const newToken = authService.getAccessToken();

      console.log('newToken', newToken);

      if (!newToken) {
        return throwError(() => new Error('Token refresh failed'));
      }

      console.log('req.url', req.url);
      console.log('req.headers', req.headers);

      const retryReq = req.clone({ 
        headers: createAuthHeaders(req.url, newToken, authService, req.headers)
      });
      return next(retryReq);
    }),
    catchError(error => throwError(() => error))
  );
}

function needsIdToken(url: string): boolean {
  const needsId = url.includes('/energy/') || url.includes('/alerts/');
  console.log('needsIdToken', url, needsId);
  return needsId;
}

function createAuthHeaders(
  url: string, 
  accessToken: string, 
  authService: AuthService,
  existingHeaders: HttpHeaders
): HttpHeaders {
  let headers = existingHeaders.set('Authorization', `Bearer ${accessToken}`);
  
  if (needsIdToken(url)) {
    const idToken = authService.getIdToken();
    console.log('idToken', idToken);

    if (idToken) {
      headers = headers.set('X-Id-Token', idToken);
    }
  }
  
  return headers;
}