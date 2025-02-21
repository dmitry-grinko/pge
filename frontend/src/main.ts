import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { HttpInterceptorFn, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor ]), withFetch()),
  ]
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
