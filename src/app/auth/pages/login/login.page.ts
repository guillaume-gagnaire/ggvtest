import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { AuthStore } from '../../stores/auth.store';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    MessageModule,
  ],
})
export class LoginPage {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  loading = signal(false);
  errorMessage = signal('');
  authStore = inject(AuthStore);
  router = inject(Router);

  async handleSubmit() {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      await this.authStore.login({
        email: (this.loginForm.value.email ?? '') as string,
        password: (this.loginForm.value.password ?? '') as string,
      });
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage.set(err.message);
    }
    this.loading.set(false);
  }
}
