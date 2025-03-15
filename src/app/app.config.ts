import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { fr } from 'primelocale/fr.json';
import { routes } from './app.routes';
import { GGViePreset } from './themes/ggvie.theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: GGViePreset,
        options: {
          darkModeSelector: false || 'none',
        },
      },
      translation: fr,
      ripple: true,
    }),
  ],
};
