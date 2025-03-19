import { Component, inject, Input } from '@angular/core';
import { ActivitiesStore } from '../../../../stores/activities.store';
import { Agent } from '../../../../models/agent.model';
import { ProjectService } from '../../../../services/project.service';
import { Project } from '../../../../models/project.model';
import { MenuModule } from 'primeng/menu';
import { ActivityService } from '../../../../services/activity.service';

@Component({
  selector: 'app-week-view-item-date',
  templateUrl: './week-view-item-date.component.html',
  styleUrl: './week-view-item-date.component.css',
  imports: [MenuModule],
})
export class WeekViewItemDateComponent {
  constructor(
    private readonly projectService: ProjectService,
    private readonly activityService: ActivityService
  ) {}

  activitiesStore = inject(ActivitiesStore);

  @Input() agent!: Agent;
  @Input() date!: string;
  @Input() project!: Project | null;

  projects: Project[] = [];

  items: { label: string; command: () => void }[] = [];

  ngOnInit() {
    this.projects = this.projectService.getAllProjects();
    this.items = [
      {
        label: 'Aucun projet',
        command: () => this.changeProject(null, this.date, this.agent.id),
      },
      ...this.projects.map((project) => ({
        label: project.name,
        command: () => this.changeProject(project.id, this.date, this.agent.id),
      })),
    ];
  }

  changeProject(projectId: string | null, date: string, agentId: string) {
    this.activityService.setActivity(date, agentId, projectId);
  }
}
