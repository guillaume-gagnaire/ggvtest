import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../auth/stores/auth.store';
import { PopoverModule } from 'primeng/popover';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
@Component({
  selector: 'app-default-layout',
  imports: [
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    PopoverModule,
    MenuModule,
    AvatarModule,
  ],
  templateUrl: './default.layout.html',
  styleUrl: './default.layout.css',
})
export class DefaultLayout {
  authStore = inject(AuthStore);
  router = inject(Router);

  drawerVisible = false;

  user = this.authStore.user;

  userMenuItems: MenuItem[] = [
    {
      label: 'Mon profil',
      icon: 'pi pi-user',
      command: () => {
        this.router.navigate(['/profile']);
      },
    },
    {
      label: 'Déconnexion',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authStore.logout();
        this.router.navigate(['/login']);
      },
    },
  ];
}
