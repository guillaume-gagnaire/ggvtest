import { TestBed } from '@angular/core/testing';
import { ActivityService } from './activity.service';
import { ActivityRepository } from '../repositories/activity.repository';
import { AgentService } from './agent.service';
import { ProjectService } from './project.service';
import { Activity, PopulatedActivity } from '../models/activity.model';
import { Agent } from '../models/agent.model';
import { Project } from '../models/project.model';

describe('ActivityService', () => {
  let service: ActivityService;
  let activityRepositoryMock: jest.Mocked<ActivityRepository>;
  let agentServiceMock: jest.Mocked<AgentService>;
  let projectServiceMock: jest.Mocked<ProjectService>;

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
    {
      id: '3',
      agentId: '1',
      projectId: '2',
      date: '2023-03-17',
    },
  ];

  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'James Bond',
      holidays: ['2023-12-25'],
      avatar: 'avatar1.jpg',
    },
    {
      id: '2',
      name: 'Jason Bourne',
      holidays: ['2023-12-24'],
      avatar: 'avatar2.jpg',
    },
  ];

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Secret Mission',
      color: '#ff0000',
      textColor: '#ffffff',
    },
    {
      id: '2',
      name: 'Operation X',
      color: '#0000ff',
      textColor: '#ffffff',
    },
  ];

  beforeEach(() => {
    activityRepositoryMock = {
      getActivities: jest.fn(),
      getActivity: jest.fn(),
      updateActivity: jest.fn(),
      createActivity: jest.fn(),
      deleteActivity: jest.fn(),
      deleteActivities: jest.fn(),
    } as unknown as jest.Mocked<ActivityRepository>;

    agentServiceMock = {
      getAgent: jest.fn(),
    } as unknown as jest.Mocked<AgentService>;

    projectServiceMock = {
      getProject: jest.fn(),
    } as unknown as jest.Mocked<ProjectService>;

    TestBed.configureTestingModule({
      providers: [
        ActivityService,
        { provide: ActivityRepository, useValue: activityRepositoryMock },
        { provide: AgentService, useValue: agentServiceMock },
        { provide: ProjectService, useValue: projectServiceMock },
      ],
    });

    service = TestBed.inject(ActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getActivitiesForRange', () => {
    it('should return populated activities for the given date range', () => {
      activityRepositoryMock.getActivities.mockReturnValue([
        mockActivities[0],
        mockActivities[1],
      ]);

      agentServiceMock.getAgent.mockImplementation((id) => {
        return mockAgents.find((a) => a.id === id) || null;
      });

      projectServiceMock.getProject.mockImplementation((id) => {
        return mockProjects.find((p) => p.id === id) || null;
      });

      const result = service.getActivitiesForRange('2023-03-15', '2023-03-16');

      expect(activityRepositoryMock.getActivities).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({
        id: '1',
        agentId: '1',
        projectId: '1',
        agent: mockAgents[0],
        project: mockProjects[0],
      });
      expect(result[1]).toMatchObject({
        id: '2',
        agentId: '2',
        projectId: '2',
        agent: mockAgents[1],
        project: mockProjects[1],
      });
    });

    it('should return activities with null agent or project if not found', () => {
      activityRepositoryMock.getActivities.mockReturnValue([mockActivities[0]]);

      agentServiceMock.getAgent.mockReturnValue(null);
      projectServiceMock.getProject.mockReturnValue(null);

      const result = service.getActivitiesForRange('2023-03-15', '2023-03-15');

      expect(result[0]).toMatchObject({
        id: '1',
        agentId: '1',
        projectId: '1',
        agent: null,
        project: null,
      });
    });
  });

  describe('setActivity', () => {
    it('should update existing activity when project ID is provided', () => {
      activityRepositoryMock.getActivity.mockReturnValue(mockActivities[0]);

      service.setActivity('2023-03-15', '1', '2');

      expect(activityRepositoryMock.getActivity).toHaveBeenCalled();
      expect(activityRepositoryMock.updateActivity).toHaveBeenCalledWith('1', {
        projectId: '2',
      });
      expect(activityRepositoryMock.createActivity).not.toHaveBeenCalled();
    });

    it('should create new activity when no existing activity is found and project ID is provided', () => {
      activityRepositoryMock.getActivity.mockReturnValue(null);

      service.setActivity('2023-03-18', '1', '2');

      expect(activityRepositoryMock.getActivity).toHaveBeenCalled();
      expect(activityRepositoryMock.createActivity).toHaveBeenCalledWith({
        date: '2023-03-18',
        agentId: '1',
        projectId: '2',
      });
      expect(activityRepositoryMock.updateActivity).not.toHaveBeenCalled();
    });

    it('should delete activity when no project ID is provided and activity exists', () => {
      activityRepositoryMock.getActivity.mockReturnValue(mockActivities[0]);

      service.setActivity('2023-03-15', '1', null);

      expect(activityRepositoryMock.getActivity).toHaveBeenCalled();
      expect(activityRepositoryMock.deleteActivity).toHaveBeenCalledWith('1');
      expect(activityRepositoryMock.updateActivity).not.toHaveBeenCalled();
      expect(activityRepositoryMock.createActivity).not.toHaveBeenCalled();
    });

    it('should do nothing when no project ID is provided and no activity exists', () => {
      activityRepositoryMock.getActivity.mockReturnValue(null);

      service.setActivity('2023-03-18', '1', null);

      expect(activityRepositoryMock.getActivity).toHaveBeenCalled();
      expect(activityRepositoryMock.deleteActivity).not.toHaveBeenCalled();
      expect(activityRepositoryMock.updateActivity).not.toHaveBeenCalled();
      expect(activityRepositoryMock.createActivity).not.toHaveBeenCalled();
    });
  });

  describe('deleteActivities', () => {
    it('should delete activities using repository', () => {
      const filter = (activity: Activity) => activity.agentId === '1';

      service.deleteActivities(filter);

      expect(activityRepositoryMock.deleteActivities).toHaveBeenCalledWith(
        filter
      );
    });
  });
});
