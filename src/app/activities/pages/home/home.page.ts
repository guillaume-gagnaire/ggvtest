import { Component, inject } from '@angular/core';
import { AppStore } from '../../../layouts/default/stores/app.store';
import { ActivitiesStore } from '../../stores/activities.store';
import { WeekViewComponent } from './components/week-view/week-view.component';
import { ButtonModule } from 'primeng/button';
import { JsonPipe } from '@angular/common';
import { ThreeMonthsViewComponent } from './components/three-months-view/three-months-view.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
  imports: [
    WeekViewComponent,
    ButtonModule,
    JsonPipe,
    ThreeMonthsViewComponent,
  ],
})
export class HomePage {
  constructor() {}

  appStore = inject(AppStore);
  activitiesStore = inject(ActivitiesStore);

  ngOnInit() {
    this.appStore.setMeta('Activités', 'home');
  }
}
