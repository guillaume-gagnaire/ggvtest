import { inject, Injectable, signal } from '@angular/core';
import { format, add, sub, startOfMonth, isWeekend } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { Activity } from '../models/activity.model';
import { ProjectRepository } from './project.repository';
import { AgentRepository } from './agent.repository';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityRepository {
  private readonly STORAGE_KEY = 'activities';

  private activities = signal<Activity[]>([]);

  constructor(private readonly storageService: StorageService) {
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    const storedActivities = this.storageService.get(this.STORAGE_KEY);
    if (!storedActivities || storedActivities.length === 0) {
      const demoActivities = this.getDemoActivities();
      this.storageService.store(this.STORAGE_KEY, demoActivities);
      this.activities.set(demoActivities);
    } else {
      this.activities.set(storedActivities);
    }
  }

  private getDemoActivities(): Activity[] {
    const projectRepository = inject(ProjectRepository);
    const projects = projectRepository.getProjects();
    const agentRepository = inject(AgentRepository);
    const agents = agentRepository.getAgents();
    const activities: Activity[] = [];

    const today = format(new Date(), 'yyyy-MM-dd');
    let dateCursor = startOfMonth(sub(new Date(), { months: 2 }));
    let formattedDateCursor = format(dateCursor, 'yyyy-MM-dd');
    while (formattedDateCursor < today) {
      if (!isWeekend(dateCursor)) {
        for (let agent of agents) {
          if (agent.holidays.includes(formattedDateCursor)) {
            continue;
          }

          activities.push({
            id: uuid(),
            agentId: agent.id,
            projectId:
              Math.random() > 0.1
                ? projects[Math.floor(Math.random() * projects.length)].id
                : null,
            date: formattedDateCursor,
          });
        }
      }
      dateCursor = add(dateCursor, { days: 1 });
      formattedDateCursor = format(dateCursor, 'yyyy-MM-dd');
    }

    return activities;
  }

  getActivity(id: string): Activity | null {
    return this.activities().find((activity) => activity.id === id) ?? null;
  }

  getActivities(filter?: (activity: Activity) => boolean): Activity[] {
    return this.activities().filter(filter || (() => true));
  }

  updateActivity(id: string, activityData: Partial<Activity>): Activity | null {
    let updatedActivity: Activity | null = null;

    this.activities.update((activities) => {
      const index = activities.findIndex((activity) => activity.id === id);
      if (index === -1) return activities;

      updatedActivity = { ...activities[index], ...activityData };
      const updatedActivities = [...activities];
      updatedActivities[index] = updatedActivity;

      return updatedActivities;
    });

    if (updatedActivity) {
      this.storageService.store(this.STORAGE_KEY, this.activities());
    }

    return updatedActivity;
  }
}
