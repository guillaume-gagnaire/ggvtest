import { Component, inject } from '@angular/core';
import { AppStore } from '../../../layouts/default/stores/app.store';
@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  imports: [],
})
export class HomePage {
  appStore = inject(AppStore);

  ngOnInit() {
    this.appStore.setMeta('Activités', 'home');
  }
}
