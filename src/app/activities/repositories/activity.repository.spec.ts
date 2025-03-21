import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivityRepository } from './activity.repository';
import { StorageService } from '../../services/storage.service';
import { Activity } from '../models/activity.model';
import { ProjectRepository } from './project.repository';
import { AgentRepository } from './agent.repository';

describe('ActivityRepository', () => {
  let repository: ActivityRepository;
  let storageServiceSpy: jest.Mocked<StorageService>;

  const mockActivities: Activity[] = [
    {
      id: '1',
      agentId: '1',
      projectId: '1',
      date: '2023-03-15',
    },
    {
      id: '2',
      agentId: '2',
      projectId: '2',
      date: '2023-03-16',
    },
  ];

  // Mock the ProjectRepository and AgentRepository
  const mockProjectRepository = {
    getProjects: jest.fn().mockReturnValue([
      { id: '1', name: 'Project 1', color: '#ff0000', textColor: '#ffffff' },
      { id: '2', name: 'Project 2', color: '#00ff00', textColor: '#ffffff' },
    ]),
  };

  const mockAgentRepository = {
    getAgents: jest.fn().mockReturnValue([
      { id: '1', name: 'Agent 1', holidays: [], avatar: 'avatar1.jpg' },
      { id: '2', name: 'Agent 2', holidays: [], avatar: 'avatar2.jpg' },
    ]),
  };

  describe('with empty storage', () => {
    beforeEach(() => {
      const spy = {
        get: jest.fn().mockReturnValue(null),
        store: jest.fn(),
      } as jest.Mocked<StorageService>;

      TestBed.configureTestingModule({
        providers: [
          ActivityRepository,
          { provide: StorageService, useValue: spy },
          { provide: ProjectRepository, useValue: mockProjectRepository },
          { provide: AgentRepository, useValue: mockAgentRepository },
        ],
      });

      repository = TestBed.inject(ActivityRepository);
      storageServiceSpy = TestBed.inject(
        StorageService
      ) as jest.Mocked<StorageService>;
    });

    it('should initialize with demo activities when storage is empty', fakeAsync(() => {
      tick();

      expect(storageServiceSpy.store).toHaveBeenCalledWith(
        'activities',
        expect.any(Array)
      );

      const activities = repository.getActivities();
      expect(activities.length).toBeGreaterThan(0);
    }));
  });

  describe('with existing storage', () => {
    beforeEach(() => {
      const spy = {
        get: jest.fn().mockReturnValue(mockActivities),
        store: jest.fn(),
      } as jest.Mocked<StorageService>;

      TestBed.configureTestingModule({
        providers: [
          ActivityRepository,
          { provide: StorageService, useValue: spy },
          { provide: ProjectRepository, useValue: mockProjectRepository },
          { provide: AgentRepository, useValue: mockAgentRepository },
        ],
      });

      repository = TestBed.inject(ActivityRepository);
      storageServiceSpy = TestBed.inject(
        StorageService
      ) as jest.Mocked<StorageService>;
    });

    it('should load existing activities from storage', fakeAsync(() => {
      tick();

      const activities = repository.getActivities();
      expect(activities.length).toBe(2);
      expect(activities).toEqual(mockActivities);
      expect(storageServiceSpy.store).not.toHaveBeenCalled();
    }));

    it('should return an activity by filter', fakeAsync(() => {
      tick();

      const activity = repository.getActivity((a) => a.id === '2');
      expect(activity).toEqual(
        expect.objectContaining({
          id: '2',
          agentId: '2',
          projectId: '2',
        })
      );
    }));

    it('should return null if the activity does not exist', fakeAsync(() => {
      tick();

      const activity = repository.getActivity((a) => a.id === '999');
      expect(activity).toBeNull();
    }));

    it('should return activities by filter', fakeAsync(() => {
      tick();

      const activities = repository.getActivities((a) => a.agentId === '1');
      expect(activities.length).toBe(1);
      expect(activities[0].id).toBe('1');
    }));

    it('should update an existing activity', fakeAsync(() => {
      tick();

      const updateData: Partial<Activity> = {
        projectId: '3',
        date: '2023-03-20',
      };

      const updatedActivity = repository.updateActivity('2', updateData);

      expect(updatedActivity).not.toBeNull();
      expect(updatedActivity?.projectId).toBe('3');
      expect(updatedActivity?.date).toBe('2023-03-20');
      expect(updatedActivity?.agentId).toBe('2');
      expect(storageServiceSpy.store).toHaveBeenCalled();
    }));

    it('should return null if the activity to update does not exist', fakeAsync(() => {
      tick();

      const updatedActivity = repository.updateActivity('999', {
        projectId: '3',
      });

      expect(updatedActivity).toBeNull();
    }));

    it('should create a new activity', fakeAsync(() => {
      tick();

      const newActivity = {
        agentId: '1',
        projectId: '2',
        date: '2023-03-17',
      };

      const createdActivity = repository.createActivity(newActivity);

      expect(createdActivity).not.toBeNull();
      expect(createdActivity?.id).toBeDefined();
      expect(createdActivity?.agentId).toBe('1');
      expect(createdActivity?.projectId).toBe('2');
      expect(storageServiceSpy.store).toHaveBeenCalled();

      const activities = repository.getActivities();
      expect(activities.length).toBe(3);
    }));

    it('should delete an activity', fakeAsync(() => {
      tick();

      repository.deleteActivity('2');

      const activities = repository.getActivities();
      expect(activities.length).toBe(1);
      expect(activities[0].id).toBe('1');
      expect(storageServiceSpy.store).toHaveBeenCalled();
    }));

    it('should delete activities by filter', fakeAsync(() => {
      tick();

      repository.deleteActivities((a) => a.agentId === '2');

      const activities = repository.getActivities();
      expect(activities.length).toBe(1);
      expect(activities[0].id).toBe('1');
      expect(storageServiceSpy.store).toHaveBeenCalled();
    }));
  });
});
