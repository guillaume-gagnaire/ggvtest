import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { publicGuard } from './auth/guards/public.guard';
import { DefaultLayout } from './layouts/default/default.layout';
import { AuthLayout } from './layouts/auth/auth.layout';
import { LoginPage } from './auth/pages/login/login.page';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [],
    canActivate: [authGuard],
    canActivateChild: [authGuard],
  },
  {
    path: 'login',
    component: AuthLayout,
    children: [{ path: '', component: LoginPage }],
    canActivate: [publicGuard],
    canActivateChild: [publicGuard],
  },
];
