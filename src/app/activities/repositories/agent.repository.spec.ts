import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AgentRepository } from './agent.repository';
import { StorageService } from '../../services/storage.service';
import { Agent } from '../models/agent.model';

describe('AgentRepository', () => {
  let repository: AgentRepository;
  let storageServiceSpy: jest.Mocked<StorageService>;

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

  describe('with empty storage', () => {
    beforeEach(async () => {
      const spy = {
        get: jest.fn().mockReturnValue(null),
        store: jest.fn(),
      } as jest.Mocked<StorageService>;

      TestBed.configureTestingModule({
        providers: [
          AgentRepository,
          { provide: StorageService, useValue: spy },
        ],
      });

      repository = TestBed.inject(AgentRepository);
      storageServiceSpy = TestBed.inject(
        StorageService
      ) as jest.Mocked<StorageService>;

      // Attendre que l'initialisation asynchrone soit terminée
      await new Promise(process.nextTick);
    });

    it('should initialize with demo agents when storage is empty', () => {
      expect(storageServiceSpy.store).toHaveBeenCalledWith(
        'agents',
        expect.any(Array)
      );

      const agents = repository.getAgents();
      expect(agents.length).toBeGreaterThan(0);
    });
  });

  describe('with existing storage', () => {
    beforeEach(async () => {
      const spy = {
        get: jest.fn().mockReturnValue(mockAgents),
        store: jest.fn(),
      } as jest.Mocked<StorageService>;

      TestBed.configureTestingModule({
        providers: [
          AgentRepository,
          { provide: StorageService, useValue: spy },
        ],
      });

      repository = TestBed.inject(AgentRepository);
      storageServiceSpy = TestBed.inject(
        StorageService
      ) as jest.Mocked<StorageService>;

      // Attendre que l'initialisation asynchrone soit terminée
      await new Promise(process.nextTick);
    });

    it('should load existing agents from storage', () => {
      const agents = repository.getAgents();
      expect(agents.length).toBe(2);
      expect(agents).toEqual(mockAgents);
      expect(storageServiceSpy.store).not.toHaveBeenCalled();
    });

    it('should return a agent by ID', () => {
      const agent = repository.getAgent('2');
      expect(agent).toEqual(
        expect.objectContaining({
          id: '2',
          name: 'Jason Bourne',
        })
      );
    });

    it('should return null if the agent does not exist', () => {
      const agent = repository.getAgent('999');
      expect(agent).toBeNull();
    });

    it('should update an existing agent', () => {
      const updateData: Partial<Agent> = {
        name: 'Updated Jason',
        avatar: 'https://new-avatar.com/300',
      };

      const updatedAgent = repository.updateAgent('2', updateData);

      expect(updatedAgent).not.toBeNull();
      expect(updatedAgent?.name).toBe('Updated Jason');
      expect(updatedAgent?.avatar).toBe('https://new-avatar.com/300');
      expect(updatedAgent?.holidays).toEqual(['2023-12-24']);
      expect(storageServiceSpy.store).toHaveBeenCalled();
    });

    it('should return null if the agent to update does not exist', () => {
      const updatedAgent = repository.updateAgent('999', { name: 'Test' });

      expect(updatedAgent).toBeNull();
    });

    it('should create a new agent', () => {
      const newAgent = {
        id: 'new-agent-id',
        name: 'Ethan Hunt',
        holidays: ['2023-12-31'],
        avatar: 'https://placecats.com/400/400',
      } as Agent;

      // Ne pas remplacer l'implémentation avec jest.spyOn
      const createdAgent = repository.createAgent(newAgent);

      expect(createdAgent).not.toBeNull();
      expect(createdAgent?.id).toBeDefined();
      expect(createdAgent?.name).toBe('Ethan Hunt');
      expect(storageServiceSpy.store).toHaveBeenCalled();

      const agents = repository.getAgents();
      expect(agents.length).toBe(3);
    });

    it('should delete an agent', () => {
      repository.deleteAgent('2');

      const agents = repository.getAgents();
      expect(agents.length).toBe(1);
      expect(agents[0].id).toBe('1');
      expect(storageServiceSpy.store).toHaveBeenCalled();
    });
  });
});
