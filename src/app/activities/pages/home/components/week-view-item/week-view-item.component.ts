import { Component, computed, inject, Input } from '@angular/core';
import { ActivitiesStore } from '../../../../stores/activities.store';
import { Agent } from '../../../../models/agent.model';
import { AvatarModule } from 'primeng/avatar';
import { format } from 'date-fns';
import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../../models/project.model';
import { SelectModule } from 'primeng/select';
import { ActivityService } from '../../../../services/activity.service';
import { WeekViewItemDateComponent } from '../week-view-item-date/week-view-item-date.component';
import { DatePipe } from '@angular/common';

type ProjectWithNull =
  | Project
  | { id: null; name: string; color: string | null };

@Component({
  selector: 'app-week-view-item',
  templateUrl: './week-view-item.component.html',
  styleUrl: './week-view-item.component.css',
  imports: [AvatarModule, SelectModule, WeekViewItemDateComponent, DatePipe],
})
export class WeekViewItemComponent {
  constructor(
    private readonly projectService: ProjectService,
    private readonly activityService: ActivityService
  ) {}

  activitiesStore = inject(ActivitiesStore);

  @Input() agent!: Agent;

  projects: ProjectWithNull[] = [];

  ngOnInit() {
    this.projects = [
      { id: null, name: 'Aucun projet', color: null },
      ...this.projectService.getAllProjects(),
    ];
  }

  items = computed(() =>
    this.activitiesStore.displayedDays().map((day) => ({
      date: format(day, 'yyyy-MM-dd'),
      activity: this.activitiesStore
        .displayedActivities()
        .find(
          (activity) =>
            activity.date === format(day, 'yyyy-MM-dd') &&
            activity.agentId === this.agent.id
        ),
    }))
  );
}
