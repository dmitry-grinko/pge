import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent {
  private readonly _authService: AuthService;
  private readonly _router: Router;

  constructor(
    authService: AuthService,
    router: Router
  ) {
    this._authService = authService;
    this._router = router;
  }

  get isAuthenticated$() {
    return this._authService.isAuthenticated$;
  }

  logout(event: Event): void {
    event.preventDefault();
    this._authService.logout();
    this._router.navigate(['/']);
  }
}
