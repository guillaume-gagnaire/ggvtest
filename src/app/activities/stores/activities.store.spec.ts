import { ActivitiesStore } from './activities.store';
import { TestBed } from '@angular/core/testing';
import { ActivityService } from '../services/activity.service';
import { format, parse } from 'date-fns';
import { PopulatedActivity } from '../models/activity.model';

describe('ActivitiesStore', () => {
  let store: any;
  let activityServiceMock: jest.Mocked<ActivityService>;

  const mockDate = new Date(2023, 2, 15); // March 15, 2023

  const mockActivities: PopulatedActivity[] = [
    {
      id: '1',
      agentId: '1',
      projectId: '1',
      date: '2023-03-15',
      agent: {
        id: '1',
        name: 'James Bond',
        holidays: [],
        avatar: 'avatar1.jpg',
      },
      project: {
        id: '1',
        name: 'Secret Mission',
        color: '#ff0000',
        textColor: '#ffffff',
      },
    },
    {
      id: '2',
      agentId: '2',
      projectId: '2',
      date: '2023-03-16',
      agent: {
        id: '2',
        name: 'Jason Bourne',
        holidays: [],
        avatar: 'avatar2.jpg',
      },
      project: {
        id: '2',
        name: 'Operation X',
        color: '#0000ff',
        textColor: '#ffffff',
      },
    },
  ];

  beforeEach(() => {
    activityServiceMock = {
      getActivitiesForRange: jest.fn().mockReturnValue(mockActivities),
      setActivity: jest.fn(),
      deleteActivities: jest.fn(),
    } as unknown as jest.Mocked<ActivityService>;

    TestBed.configureTestingModule({
      providers: [
        ActivitiesStore,
        { provide: ActivityService, useValue: activityServiceMock },
      ],
    });

    store = TestBed.inject(ActivitiesStore);

    // Set initial date cursor to our test date
    store.setDateCursor(format(mockDate, 'yyyy-MM-dd'));
  });

  it('should have the correct initial state with date cursor set', () => {
    expect(store.dateCursor()).toEqual(
      parse('2023-03-15', 'yyyy-MM-dd', new Date())
    );
  });

  describe('displayedActivities', () => {
    it('should return activities for the current week from activity service', () => {
      const activities = store.displayedActivities();

      expect(activityServiceMock.getActivitiesForRange).toHaveBeenCalled();
      expect(activities).toEqual(mockActivities);
    });
  });

  describe('displayedDays', () => {
    it('should return array of dates for the displayed week', () => {
      const days = store.displayedDays();

      expect(days).toBeInstanceOf(Array);
      expect(days.length).toBe(5); // Monday to Friday
      expect(format(days[0], 'yyyy-MM-dd')).toBe('2023-03-13'); // Monday
      expect(format(days[4], 'yyyy-MM-dd')).toBe('2023-03-17'); // Friday
    });
  });

  describe('displayedMacroDays', () => {
    it('should generate calendar macro structure for current and surrounding months', () => {
      const months = store.displayedMacroDays();

      expect(months).toBeInstanceOf(Array);
      expect(months.length).toBe(3); // previous, current, next month

      // Check current month (index 1)
      const currentMonth = months[1];
      expect(currentMonth.weeks.length).toBeGreaterThan(0);

      // Check that at least one day contains the test date
      let foundTestDate = false;
      for (const week of currentMonth.weeks) {
        for (const day of week.days) {
          if (day.date === '2023-03-15') {
            foundTestDate = true;
            break;
          }
        }
        if (foundTestDate) break;
      }
      expect(foundTestDate).toBe(true);
    });
  });

  describe('nextWeek', () => {
    it('should advance date cursor by 7 days', () => {
      store.nextWeek();

      const newDateCursor = store.dateCursor();
      const expectedDate = parse('2023-03-22', 'yyyy-MM-dd', new Date());

      expect(format(newDateCursor, 'yyyy-MM-dd')).toBe(
        format(expectedDate, 'yyyy-MM-dd')
      );
    });
  });

  describe('previousWeek', () => {
    it('should decrease date cursor by 7 days', () => {
      store.previousWeek();

      const newDateCursor = store.dateCursor();
      const expectedDate = parse('2023-03-08', 'yyyy-MM-dd', new Date());

      expect(format(newDateCursor, 'yyyy-MM-dd')).toBe(
        format(expectedDate, 'yyyy-MM-dd')
      );
    });
  });

  describe('setDateCursor', () => {
    it('should update date cursor to specified date', () => {
      store.setDateCursor('2023-04-01');

      const newDateCursor = store.dateCursor();
      const expectedDate = parse('2023-04-01', 'yyyy-MM-dd', new Date());

      expect(format(newDateCursor, 'yyyy-MM-dd')).toBe(
        format(expectedDate, 'yyyy-MM-dd')
      );
    });
  });
});
