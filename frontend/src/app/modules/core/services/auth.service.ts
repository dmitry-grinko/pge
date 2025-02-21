import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer, Subscription } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private readonly REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutes
  private readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshInProgress = false;
  private refreshSubscription?: Subscription;
  private destroy$ = new Subject<void>();

  public accessToken$ = this.accessTokenSubject.asObservable();
  public isAuthenticated$ = this.accessToken$.pipe(
    map(token => !!token)
  );

  constructor() {
    axios.defaults.baseURL = environment.apiUrl;
    this.setupRefreshTimer();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshSubscription?.unsubscribe();
  }

  private setupRefreshTimer() {
    this.refreshSubscription?.unsubscribe();
    
    this.refreshSubscription = timer(this.REFRESH_INTERVAL)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !!this.accessTokenSubject.value)
      )
      .subscribe(() => {
        this.refreshToken();
      });
  }

  private setTokens(tokens: AuthTokens) {
    this.accessTokenSubject.next(tokens.accessToken);
    this.setupRefreshTimer();
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post<AuthTokens>('/auth/login', { email, password }, {
        withCredentials: true
      });
      this.setTokens(response.data);
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  public async refreshToken(): Promise<void> {
    if (this.refreshInProgress) {
      return;
    }

    this.refreshInProgress = true;

    try {
      const response = await axios.post<Omit<AuthTokens, 'refreshToken'>>('/auth/refresh', {}, {
        withCredentials: true
      });
      
      this.accessTokenSubject.next(response.data.accessToken);
      this.setupRefreshTimer();
    } catch (error) {
      this.logout();
      throw error;
    } finally {
      this.refreshInProgress = false;
    }
  }

  public logout(): void {
    this.accessTokenSubject.next(null);
    // Call logout endpoint which will clear the cookie
    axios.post('/auth/logout', {}, { withCredentials: true });
    this.refreshSubscription?.unsubscribe();
  }

  public async signup(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('/auth/sign-up', { email, password });
      this.setTokens(response.data);
    } catch (error) {
      throw error;
    }
  }

  public async verify(token: string): Promise<void> {
    try {
      await axios.post('/auth/verify', { token });
    } catch (error) {
      throw error;
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    try {
      await axios.post('/auth/password-reset', { email });
    } catch (error) {
      throw error;
    }
  }
}
