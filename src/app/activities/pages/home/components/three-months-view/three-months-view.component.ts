import { ActivitiesStore } from '../../../../stores/activities.store';
import { Component, computed, inject } from '@angular/core';
import { ActivityService } from '../../../../services/activity.service';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { isSameWeek, parse } from 'date-fns';

@Component({
  selector: 'app-three-months-view',
  templateUrl: './three-months-view.component.html',
  styleUrl: './three-months-view.component.css',
  imports: [TooltipModule, CommonModule],
})
export class ThreeMonthsViewComponent {
  constructor(private readonly activityService: ActivityService) {}

  activitiesStore = inject(ActivitiesStore);

  projectColors: Record<string, string> = {};

  months = computed(() => {
    const displayedMonths = this.activitiesStore.displayedMacroDays();
    return displayedMonths.map((month) => {
      return {
        ...month,
        weeks: month.weeks.map((week) => ({
          ...week,
          days: week.days.map((day) => ({
            ...day,
            activities: day.date
              ? this.activityService.getActivitiesForRange(day.date, day.date)
              : [],
          })),
        })),
      };
    });
  });

  formatDate(date: string) {
    return date.split('-').reverse().join('/');
  }

  setDateCursor(date: string) {
    this.activitiesStore.setDateCursor(date);
  }

  isCurrentWeek(date: string) {
    return isSameWeek(
      this.activitiesStore.dateCursor(),
      parse(date, 'yyyy-MM-dd', new Date())
    );
  }
}
