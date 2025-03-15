import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { authStore } from '../stores/auth.store';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const store = inject(authStore);

  // Si le store est en cours de chargement, on attend
  if (store.isLoading()) {
    await store.init();
  }

  // Si l'utilisateur n'est pas authentifié, on redirige vers la page de login
  if (!store.isAuthenticated()) {
    router.navigate(['/login'], {
      queryParams: { redirectUrl: state.url },
    });
    return false;
  }

  return true;
};
