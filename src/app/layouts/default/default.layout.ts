import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../auth/stores/auth.store';
import { PopoverModule } from 'primeng/popover';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuComponent } from './components/menu/menu.component';
import { AppStore } from './stores/app.store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-default-layout',
  imports: [
    RouterOutlet,
    DrawerModule,
    ButtonModule,
    PopoverModule,
    MenuModule,
    AvatarModule,
    MenuComponent,
  ],
  templateUrl: './default.layout.html',
  styleUrl: './default.layout.css',
})
export class DefaultLayout {
  authStore = inject(AuthStore);
  router = inject(Router);
  appStore = inject(AppStore);

  drawerVisible = false;

  user = this.authStore.user;

  userMenuItems: MenuItem[] = [
    {
      label: 'Déconnexion',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authStore.logout();
        this.router.navigate(['/login']);
      },
    },
  ];

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.drawerVisible = false;
      });
  }
}
