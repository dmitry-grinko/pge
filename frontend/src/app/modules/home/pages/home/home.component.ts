import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../modules/core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  email = 'dmitry.grinko@gmail.com';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async navigateToApp(): Promise<void> {
    const isAuthenticated = await firstValueFrom(this.authService.isAuthenticated$);
    
    if (isAuthenticated) {
      await this.router.navigate(['/dashboard']);
    } else {
      await this.router.navigate(['/auth/login']);
    }
  }
}
