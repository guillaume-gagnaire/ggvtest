import { Component, inject } from '@angular/core';
import { AppStore } from '../../../layouts/default/stores/app.store';
@Component({
  selector: 'app-agents-page',
  templateUrl: './agents.page.html',
  styleUrl: './agents.page.css',
  imports: [],
})
export class AgentsPage {
  appStore = inject(AppStore);

  ngOnInit() {
    this.appStore.setMeta('Agents', 'agents');
  }
}
