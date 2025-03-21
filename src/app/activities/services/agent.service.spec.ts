import { TestBed } from '@angular/core/testing';
import { AgentService } from './agent.service';
import { AgentRepository } from '../repositories/agent.repository';
import { Agent } from '../models/agent.model';

describe('AgentService', () => {
  let service: AgentService;
  let agentRepositoryMock: jest.Mocked<AgentRepository>;

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

  beforeEach(() => {
    agentRepositoryMock = {
      getAgents: jest.fn().mockReturnValue(mockAgents),
      getAgent: jest.fn().mockImplementation((id) => {
        return mockAgents.find((a) => a.id === id) || null;
      }),
      updateAgent: jest.fn(),
      createAgent: jest.fn(),
      deleteAgent: jest.fn(),
    } as unknown as jest.Mocked<AgentRepository>;

    TestBed.configureTestingModule({
      providers: [
        AgentService,
        { provide: AgentRepository, useValue: agentRepositoryMock },
      ],
    });

    service = TestBed.inject(AgentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAgents', () => {
    it('should return all agents from repository', () => {
      const agents = service.getAgents();

      expect(agentRepositoryMock.getAgents).toHaveBeenCalled();
      expect(agents).toEqual(mockAgents);
    });
  });

  describe('getAgent', () => {
    it('should return agent by ID when found', () => {
      const agent = service.getAgent('1');

      expect(agentRepositoryMock.getAgent).toHaveBeenCalledWith('1');
      expect(agent).toEqual(mockAgents[0]);
    });

    it('should return null when agent not found', () => {
      agentRepositoryMock.getAgent.mockReturnValueOnce(null);

      const agent = service.getAgent('999');

      expect(agentRepositoryMock.getAgent).toHaveBeenCalledWith('999');
      expect(agent).toBeNull();
    });
  });

  describe('updateAgent', () => {
    it('should update agent using repository', () => {
      const updatedData = {
        name: 'Updated Agent',
      };

      service.updateAgent('1', updatedData);

      expect(agentRepositoryMock.updateAgent).toHaveBeenCalledWith(
        '1',
        updatedData
      );
    });
  });

  describe('createAgent', () => {
    it('should create agent using repository with uuid', () => {
      const newAgent = {
        name: 'New Agent',
        holidays: [],
        avatar: 'new-avatar.jpg',
      };

      service.createAgent(newAgent);

      expect(agentRepositoryMock.createAgent).toHaveBeenCalled();
      const createdAgent = agentRepositoryMock.createAgent.mock.calls[0][0];
      expect(createdAgent.name).toBe('New Agent');
      expect(createdAgent.holidays).toEqual([]);
      expect(createdAgent.avatar).toBe('new-avatar.jpg');
      expect(createdAgent.id).toBeDefined();
    });
  });

  describe('deleteAgent', () => {
    it('should delete agent using repository', () => {
      service.deleteAgent('1');

      expect(agentRepositoryMock.deleteAgent).toHaveBeenCalledWith('1');
    });
  });
});
