import { Injectable } from '@angular/core';
import { ActivityRepository } from '../repositories/activity.repository';
import { Activity, PopulatedActivity } from '../models/activity.model';
import { AgentService } from './agent.service';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly agentService: AgentService,
    private readonly projectService: ProjectService
  ) {}

  getActivitiesForRange(from: string, to: string): PopulatedActivity[] {
    return this.activityRepository
      .getActivities(
        (activity: Activity) => activity.date >= from && activity.date <= to
      )
      .map((activity) => ({
        ...activity,
        agent: this.agentService.getAgent(activity.agentId),
        project: this.projectService.getProject(activity.projectId),
      }));
  }

  setActivity(date: string, agentId: string, projectId: string | null): void {
    const existant = this.activityRepository.getActivity(
      (activity: Activity) =>
        activity.date === date && activity.agentId === agentId
    );

    if (projectId) {
      if (existant) {
        this.activityRepository.updateActivity(existant.id, {
          projectId: projectId,
        });
      } else {
        this.activityRepository.createActivity({
          date: date,
          agentId: agentId,
          projectId: projectId,
        });
      }
    } else {
      if (existant) {
        this.activityRepository.deleteActivity(existant.id);
      }
    }
  }

  deleteActivities(filter: (activity: Activity) => boolean): void {
    this.activityRepository.deleteActivities(filter);
  }
}
