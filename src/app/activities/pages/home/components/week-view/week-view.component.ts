import { Agent } from '../../../../models/agent.model';
import { ActivitiesStore } from '../../../../stores/activities.store';
import { AgentService } from '../../../../services/agent.service';
import { Component, inject } from '@angular/core';
import { WeekViewItemComponent } from '../week-view-item/week-view-item.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.css',
  imports: [WeekViewItemComponent, DatePipe],
})
export class WeekViewComponent {
  constructor(private readonly agentService: AgentService) {}

  activitiesStore = inject(ActivitiesStore);

  agents: Agent[] = [];

  ngOnInit() {
    this.agents = this.agentService.getAgents();
  }
}
