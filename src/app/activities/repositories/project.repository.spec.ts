import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProjectRepository } from './project.repository';
import { StorageService } from '../../services/storage.service';
import { Project } from '../models/project.model';

describe('ProjectRepository', () => {
  let repository: ProjectRepository;
  let storageServiceSpy: jest.Mocked<StorageService>;

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

  describe('with empty storage', () => {
    beforeEach(async () => {
      const spy = {
        get: jest.fn().mockReturnValue(null),
        store: jest.fn(),
      } as jest.Mocked<StorageService>;

      TestBed.configureTestingModule({
        providers: [
          ProjectRepository,
          { provide: StorageService, useValue: spy },
        ],
      });

      repository = TestBed.inject(ProjectRepository);
      storageServiceSpy = TestBed.inject(
        StorageService
      ) as jest.Mocked<StorageService>;

      // Attendre que l'initialisation asynchrone soit terminée
      await new Promise(process.nextTick);
    });

    it('should initialize with demo projects when storage is empty', () => {
      expect(storageServiceSpy.store).toHaveBeenCalledWith(
        'projects',
        expect.any(Array)
      );

      const projects = repository.getProjects();
      expect(projects.length).toBeGreaterThan(0);
    });
  });

  describe('with existing storage', () => {
    beforeEach(async () => {
      const spy = {
        get: jest.fn().mockReturnValue(mockProjects),
        store: jest.fn(),
      } as jest.Mocked<StorageService>;

      TestBed.configureTestingModule({
        providers: [
          ProjectRepository,
          { provide: StorageService, useValue: spy },
        ],
      });

      repository = TestBed.inject(ProjectRepository);
      storageServiceSpy = TestBed.inject(
        StorageService
      ) as jest.Mocked<StorageService>;

      // Attendre que l'initialisation asynchrone soit terminée
      await new Promise(process.nextTick);
    });

    it('should load existing projects from storage', () => {
      const projects = repository.getProjects();
      expect(projects.length).toBe(2);
      expect(projects).toEqual(mockProjects);
      expect(storageServiceSpy.store).not.toHaveBeenCalled();
    });

    it('should return a project by ID', () => {
      const project = repository.getProject('2');
      expect(project).toEqual(
        expect.objectContaining({
          id: '2',
          name: 'Operation X',
        })
      );
    });

    it('should return null if the project does not exist', () => {
      const project = repository.getProject('999');
      expect(project).toBeNull();
    });

    it('should update an existing project', () => {
      const updateData: Partial<Project> = {
        name: 'Updated Mission',
        color: '#00ff00',
      };

      const updatedProject = repository.updateProject('2', updateData);

      expect(updatedProject).not.toBeNull();
      expect(updatedProject?.name).toBe('Updated Mission');
      expect(updatedProject?.color).toBe('#00ff00');
      expect(updatedProject?.textColor).toBe('#ffffff');
      expect(storageServiceSpy.store).toHaveBeenCalled();
    });

    it('should return null if the project to update does not exist', () => {
      const updatedProject = repository.updateProject('999', { name: 'Test' });

      expect(updatedProject).toBeNull();
    });

    it('should create a new project', () => {
      const newProject = {
        id: 'new-project-id',
        name: 'New Mission',
        color: '#00ff00',
        textColor: '#000000',
      } as Project;

      // Ne pas remplacer l'implémentation avec jest.spyOn
      const createdProject = repository.createProject(newProject);

      expect(createdProject).not.toBeNull();
      expect(createdProject?.id).toBeDefined();
      expect(createdProject?.name).toBe('New Mission');
      expect(storageServiceSpy.store).toHaveBeenCalled();

      const projects = repository.getProjects();
      expect(projects.length).toBe(3);
    });

    it('should delete a project', () => {
      repository.deleteProject('2');

      const projects = repository.getProjects();
      expect(projects.length).toBe(1);
      expect(projects[0].id).toBe('1');
      expect(storageServiceSpy.store).toHaveBeenCalled();
    });
  });
});
