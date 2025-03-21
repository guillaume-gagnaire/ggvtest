import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../models/project.model';

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepositoryMock: jest.Mocked<ProjectRepository>;

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
    projectRepositoryMock = {
      getProjects: jest.fn().mockReturnValue(mockProjects),
      getProject: jest.fn().mockImplementation((id) => {
        return mockProjects.find((p) => p.id === id) || null;
      }),
      updateProject: jest.fn().mockImplementation((id, data) => {
        const project = mockProjects.find((p) => p.id === id);
        if (!project) return null;
        return { ...project, ...data };
      }),
      createProject: jest.fn().mockImplementation((project) => project),
      deleteProject: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<ProjectRepository>;

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        { provide: ProjectRepository, useValue: projectRepositoryMock },
      ],
    });

    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllProjects', () => {
    it('should return all projects from repository', () => {
      const projects = service.getAllProjects();

      expect(projectRepositoryMock.getProjects).toHaveBeenCalled();
      expect(projects).toEqual(mockProjects);
    });
  });

  describe('getProject', () => {
    it('should return project by ID when found', () => {
      const project = service.getProject('1');

      expect(projectRepositoryMock.getProject).toHaveBeenCalledWith('1');
      expect(project).toEqual(mockProjects[0]);
    });

    it('should return null when project not found', () => {
      projectRepositoryMock.getProject.mockReturnValueOnce(null);

      const project = service.getProject('999');

      expect(projectRepositoryMock.getProject).toHaveBeenCalledWith('999');
      expect(project).toBeNull();
    });
  });

  describe('updateProject', () => {
    it('should update project using repository', () => {
      const updatedData = {
        name: 'Updated Project',
      };

      const result = service.updateProject('1', updatedData);

      expect(projectRepositoryMock.updateProject).toHaveBeenCalledWith(
        '1',
        updatedData
      );
      expect(result).not.toBeNull();
      if (result) {
        expect(result.name).toBe('Updated Project');
      }
    });

    it('should return null when update fails', () => {
      projectRepositoryMock.updateProject.mockReturnValueOnce(null);

      const result = service.updateProject('999', { name: 'Updated Project' });

      expect(projectRepositoryMock.updateProject).toHaveBeenCalledWith('999', {
        name: 'Updated Project',
      });
      expect(result).toBeNull();
    });
  });

  describe('createProject', () => {
    it('should create project using repository', () => {
      const newProject = {
        name: 'New Project',
        color: '#00ff00',
        textColor: '#000000',
      };

      const expectedProject = {
        id: expect.any(String),
        ...newProject,
      };

      projectRepositoryMock.createProject.mockReturnValueOnce(expectedProject);

      const result = service.createProject(newProject);

      expect(result).toEqual(expectedProject);
      expect(projectRepositoryMock.createProject).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          name: 'New Project',
          color: '#00ff00',
          textColor: '#000000',
        })
      );
    });
  });

  describe('deleteProject', () => {
    it('should delete project using repository', () => {
      const result = service.deleteProject('1');

      expect(projectRepositoryMock.deleteProject).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should return false when delete fails', () => {
      projectRepositoryMock.deleteProject.mockReturnValueOnce(false);

      const result = service.deleteProject('999');

      expect(projectRepositoryMock.deleteProject).toHaveBeenCalledWith('999');
      expect(result).toBe(false);
    });
  });
});
