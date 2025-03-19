import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Activity } from '../models/activity.model';
import { addDays, eachDayOfInterval, format, subDays } from 'date-fns';
import { endOfWeek } from 'date-fns';
import { computed, inject } from '@angular/core';
import { startOfWeek } from 'date-fns';
import { ActivityService } from '../services/activity.service';

type ActivitiesState = {
  dateCursor: Date;
};

const initialState: ActivitiesState = {
  dateCursor: new Date(),
};

export const ActivitiesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ dateCursor }) => {
    const activityService = inject(ActivityService);

    return {
      displayedActivities: computed(() =>
        activityService.getActivitiesForRange(
          format(startOfWeek(dateCursor(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
          format(endOfWeek(dateCursor(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
        )
      ),
      displayedDays: computed(() =>
        eachDayOfInterval({
          start: startOfWeek(dateCursor(), { weekStartsOn: 1 }),
          end: endOfWeek(dateCursor(), { weekStartsOn: 1 }),
        })
      ),
    };
  }),
  withMethods((store) => ({
    nextWeek() {
      patchState(store, () => ({
        dateCursor: addDays(store.dateCursor(), 7),
      }));
    },
    previousWeek() {
      patchState(store, () => ({
        dateCursor: subDays(store.dateCursor(), 7),
      }));
    },
  }))
);
