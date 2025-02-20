#!/bin/bash

# Create new Angular project
ng new frontend --routing --style=scss --skip-git --directory frontend

cd frontend

# Install required dependencies
npm install @ng-bootstrap/ng-bootstrap bootstrap @popperjs/core
npm install axios
npm install @angular/forms

# Create core module and services
ng generate module core
ng generate service core/services/auth
ng generate service core/services/error-handler
ng generate interceptor core/interceptors/auth
ng generate guard core/guards/auth

# Create shared module and components
ng generate module shared
ng generate component shared/components/header

# Create feature modules and components
ng generate module features/auth --routing
ng generate component features/auth/pages/login
ng generate component features/auth/pages/signup
ng generate component features/auth/pages/forgot-password
ng generate component features/auth/pages/confirm-email
ng generate component features/auth/pages/new-password

ng generate module features/dashboard --routing
ng generate component features/dashboard/pages/dashboard

# Create public pages
ng generate component pages/home

# Update angular.json to include Bootstrap styles
node -e "
  const fs = require('fs');
  const angularJson = JSON.parse(fs.readFileSync('angular.json', 'utf8'));
  const projectName = Object.keys(angularJson.projects)[0];
  const styles = angularJson.projects[projectName].architect.build.options.styles;
  styles.push('node_modules/bootstrap/dist/css/bootstrap.min.css');
  fs.writeFileSync('angular.json', JSON.stringify(angularJson, null, 2));
"

# Create environment files with API configuration
mkdir -p src/environments
echo "export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};" > src/environments/environment.ts

echo "export const environment = {
  production: true,
  apiUrl: 'YOUR_PRODUCTION_API_URL'
};" > src/environments/environment.prod.ts

# Create auth service
cat > src/app/core/services/auth.service.ts << 'EOL'
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios';
import { environment } from '../../../environments/environment';

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
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('/auth/login', { email, password });
      this.setToken(response.data.token);
    } catch (error) {
      throw error;
    }
  }

  public async signup(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post('/auth/sign-up', { email, password });
      this.setToken(response.data.token);
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
EOL

# Create auth guard
cat > src/app/core/guards/auth.guard.ts << 'EOL'
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
EOL

# Create auth interceptor
cat > src/app/core/interceptors/auth.interceptor.ts << 'EOL'
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request);
  }
}
EOL

# Create error handler service
cat > src/app/core/services/error-handler.service.ts << 'EOL'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ErrorMessage {
  message: string;
  type: 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private errorSubject = new Subject<ErrorMessage>();
  public error$ = this.errorSubject.asObservable();

  handleError(error: any): void {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      message = error.response.data.message || error.response.data || message;
    } else if (error.message) {
      message = error.message;
    }

    this.errorSubject.next({
      message,
      type: 'error'
    });
  }
}
EOL

# Create header component
cat > src/app/shared/components/header/header.component.ts << 'EOL'
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" routerLink="/">My App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <ng-container *ngIf="isAuthenticated$ | async; else unauthLinks">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" (click)="logout($event)">Sign Out</a>
              </li>
            </ng-container>
            <ng-template #unauthLinks>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/login">Login</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/signup">Sign Up</a>
              </li>
            </ng-template>
          </ul>
        </div>
      </div>
    </nav>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  private readonly _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  get isAuthenticated$() {
    return this._authService.isAuthenticated$;
  }

  logout(event: Event): void {
    event.preventDefault();
    this._authService.logout();
  }
}
EOL

# Create app routing module
cat > src/app/app-routing.module.ts << 'EOL'
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
EOL

# Create app module
cat > src/app/app.module.ts << 'EOL'
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HomeComponent } from './pages/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    NgbModule,
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
EOL

# Create app component
cat > src/app/app.component.ts << 'EOL'
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  standalone: true,
  imports: [RouterModule, SharedModule]
})
export class AppComponent {}
EOL

# Create auth module
cat > src/app/features/auth/auth.module.ts << 'EOL'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'new-password', component: NewPasswordComponent }
];

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ConfirmEmailComponent,
    NewPasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
EOL

# Create login component
cat > src/app/features/auth/pages/login/login.component.ts << 'EOL'
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="text-center mb-4">Login</h2>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" formControlName="email">
                <div class="text-danger" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']">
                  Email is required
                </div>
                <div class="text-danger" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['email']">
                  Please enter a valid email
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" formControlName="password">
                <div class="text-danger" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']">
                  Password is required
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100" [disabled]="loginForm.invalid || isLoading">
                {{ isLoading ? 'Loading...' : 'Login' }}
              </button>
            </form>
            <div class="mt-3 text-center">
              <a routerLink="/auth/forgot-password">Forgot password?</a>
            </div>
            <div class="mt-3 text-center">
              Don't have an account? <a routerLink="/auth/signup">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        await this.authService.login(
          this.loginForm.get('email')?.value,
          this.loginForm.get('password')?.value
        );
        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.errorHandler.handleError(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
EOL

# Create signup component
cat > src/app/features/auth/pages/signup/signup.component.ts << 'EOL'
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-signup',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="text-center mb-4">Sign Up</h2>
            <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" formControlName="email">
                <div class="text-danger" *ngIf="signupForm.get('email')?.touched && signupForm.get('email')?.errors?.['required']">
                  Email is required
                </div>
                <div class="text-danger" *ngIf="signupForm.get('email')?.touched && signupForm.get('email')?.errors?.['email']">
                  Please enter a valid email
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" formControlName="password">
                <div class="text-danger" *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.errors?.['required']">
                  Password is required
                </div>
                <div class="text-danger" *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.errors?.['minlength']">
                  Password must be at least 6 characters
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100" [disabled]="signupForm.invalid || isLoading">
                {{ isLoading ? 'Loading...' : 'Sign Up' }}
              </button>
            </form>
            <div class="mt-3 text-center">
              Already have an account? <a routerLink="/auth/login">Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      try {
        await this.authService.signup(
          this.signupForm.get('email')?.value,
          this.signupForm.get('password')?.value
        );
        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.errorHandler.handleError(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
EOL

# Create forgot password component
cat > src/app/features/auth/pages/forgot-password/forgot-password.component.ts << 'EOL'
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

@Component({
  selector: 'app-forgot-password',
  template: `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="text-center mb-4">Forgot Password</h2>
            <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" formControlName="email">
                <div class="text-danger" *ngIf="forgotPasswordForm.get('email')?.touched && forgotPasswordForm.get('email')?.errors?.['required']">
                  Email is required
                </div>
                <div class="text-danger" *ngIf="forgotPasswordForm.get('email')?.touched && forgotPasswordForm.get('email')?.errors?.['email']">
                  Please enter a valid email
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100" [disabled]="forgotPasswordForm.invalid || isLoading">
                {{ isLoading ? 'Loading...' : 'Reset Password' }}
              </button>
            </form>
            <div class="mt-3 text-center">
              <a routerLink="/auth/login">Back to Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      try {
        await this.authService.requestPasswordReset(
          this.forgotPasswordForm.get('email')?.value
        );
        // Show success message
      } catch (error) {
        this.errorHandler.handleError(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
EOL

# Create dashboard module
cat > src/app/features/dashboard/dashboard.module.ts << 'EOL'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
EOL

# Create dashboard component
cat > src/app/features/dashboard/pages/dashboard/dashboard.component.ts << 'EOL'
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {}
EOL

# Create home component
cat > src/app/pages/home/home.component.ts << 'EOL'
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="row">
      <div class="col-12 text-center">
        <h1 class="display-4">Welcome to Our App</h1>
        <p class="lead">This is a simple authentication demo application.</p>
        <div class="mt-4">
          <a routerLink="/auth/login" class="btn btn-primary me-2">Login</a>
          <a routerLink="/auth/signup" class="btn btn-outline-primary">Sign Up</a>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
EOL

# Create shared module
cat > src/app/shared/shared.module.ts << 'EOL'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ]
})
export class SharedModule { }
EOL

# Create core module
cat > src/app/core/core.module.ts << 'EOL'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
EOL

echo "All components and modules have been created successfully!"
