import { Component, inject } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { AppStore } from '../../stores/app.store';

@Component({
  imports: [MenuModule],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  drawerVisible = false;
  appStore = inject(AppStore);
}
