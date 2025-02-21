import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule]
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
