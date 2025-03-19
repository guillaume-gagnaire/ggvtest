import { Component, inject } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  drawerVisible = false;
  appStore = inject(AppStore);
}
