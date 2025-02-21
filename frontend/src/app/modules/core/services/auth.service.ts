import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    axios.defaults.baseURL = environment.apiUrl;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private setToken(token: string): void {
    console.log('setting token', token);
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('/auth/login', { email, password });
      console.log('login response', response);
      this.setToken(response.data.accessToken);
    } catch (error) {
      throw error;
    }
  }

  public async signup(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('/auth/sign-up', { email, password });
      this.setToken(response.data.accessToken);
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

  public logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }
}
