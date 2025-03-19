import { Component, inject } from '@angular/core';
import { AppStore } from '../../../layouts/default/stores/app.store';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects.page.html',
  styleUrl: './projects.page.css',
  standalone: true,
})
export class ProjectsPage {
  appStore = inject(AppStore);

  ngOnInit() {
    this.appStore.setMeta('Projets', 'projects');
  }
}
