import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
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
