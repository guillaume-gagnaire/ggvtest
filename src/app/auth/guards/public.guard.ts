import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

export const publicGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const store = inject(AuthStore);

  if (store.isLoading()) {
    await store.init();
  }

  if (store.isAuthenticated()) {
    const redirectUrl = route.queryParams['redirectUrl'] || '/';
    router.navigate([redirectUrl]);
    return false;
  }

  return true;
};
