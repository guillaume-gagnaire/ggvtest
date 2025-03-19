import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { publicGuard } from './auth/guards/public.guard';
import { DefaultLayout } from './layouts/default/default.layout';
import { AuthLayout } from './layouts/auth/auth.layout';
import { LoginPage } from './auth/pages/login/login.page';
import { HomePage } from './activities/pages/home/home.page';
import { ProjectsPage } from './activities/pages/projects/projects.page';
import { AgentsPage } from './activities/pages/agents/agents.page';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'projects',
        component: ProjectsPage,
      },
      {
        path: 'agents',
        component: AgentsPage,
      },
    ],
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
