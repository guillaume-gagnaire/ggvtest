import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  format,
  isMonday,
  isSameMonth,
  parse,
  startOfMonth,
  subDays,
} from 'date-fns';
import { endOfWeek } from 'date-fns';
import { computed, inject } from '@angular/core';
import { startOfWeek } from 'date-fns';
import { ActivityService } from '../services/activity.service';
import { MacroDay, MacroMonth, MacroWeek } from '../models/activity.model';

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
          format(
            subDays(endOfWeek(dateCursor(), { weekStartsOn: 1 }), 2),
            'yyyy-MM-dd'
          )
        )
      ),
      displayedDays: computed(() =>
        eachDayOfInterval({
          start: startOfWeek(dateCursor(), { weekStartsOn: 1 }),
          end: subDays(endOfWeek(dateCursor(), { weekStartsOn: 1 }), 2),
        })
      ),
      displayedMacroDays: computed(() => {
        const months: MacroMonth[] = [];

        for (let i = -1; i <= 1; i++) {
          const month = addMonths(dateCursor(), i);
          let cursor = startOfMonth(month);
          const weeks: MacroWeek[] = [];
          let days: MacroDay[] = [];

          // rewind to first monday
          while (!isMonday(cursor)) {
            cursor = subDays(cursor, 1);
            days.push({ date: null });
          }
          cursor = startOfMonth(month);

          while (isSameMonth(cursor, month)) {
            days.push({ date: format(cursor, 'yyyy-MM-dd') });
            if (days.length === 7) {
              weeks.push({ days });
              days = [];
            }
            cursor = addDays(cursor, 1);
          }

          if (days.length > 0) {
            weeks.push({ days });
          }

          months.push({ weeks });
        }

        return months;
      }),
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
    setDateCursor(date: string) {
      patchState(store, () => ({
        dateCursor: parse(date, 'yyyy-MM-dd', new Date()),
      }));
    },
  }))
);
