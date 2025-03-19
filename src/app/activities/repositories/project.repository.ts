import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectRepository {
  private readonly STORAGE_KEY = 'projects';
  private readonly DEMO_PROJECTS: Project[] = [
    {
      id: '1',
      name: 'Spectre',
      color: '#FF0000',
    },
    {
      id: '2',
      name: 'Quantum',
      color: '#00FF00',
    },
    {
      id: '3',
      name: 'Skyfall',
      color: '#0000FF',
    },
  ];

  private projects = signal<Project[]>([]);

  constructor(private readonly storageService: StorageService) {
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    const storedProjects = this.storageService.get(this.STORAGE_KEY);
    if (!storedProjects || storedProjects.length === 0) {
      this.storageService.store(this.STORAGE_KEY, this.DEMO_PROJECTS);
      this.projects.set(this.DEMO_PROJECTS);
    } else {
      this.projects.set(storedProjects);
    }
  }

  getProject(id: string): Project | null {
    return this.projects().find((project) => project.id === id) ?? null;
  }

  getProjects(filter?: (project: Project) => boolean): Project[] {
    return this.projects().filter(filter || (() => true));
  }

  createProject(project: Project): Project {
    this.projects.update((projects) => {
      return [...projects, project];
    });

    this.storageService.store(this.STORAGE_KEY, this.projects());
    return project;
  }

  updateProject(id: string, projectData: Partial<Project>): Project | null {
    let updatedProject: Project | null = null;

    this.projects.update((projects) => {
      const index = projects.findIndex((project) => project.id === id);
      if (index === -1) return projects;

      updatedProject = { ...projects[index], ...projectData };
      const updatedProjects = [...projects];
      updatedProjects[index] = updatedProject;

      return updatedProjects;
    });

    if (updatedProject) {
      this.storageService.store(this.STORAGE_KEY, this.projects());
    }

    return updatedProject;
  }

  deleteProject(id: string): boolean {
    let deleted = false;

    this.projects.update((projects) => {
      const initialLength = projects.length;
      const filteredProjects = projects.filter((project) => project.id !== id);
      deleted = filteredProjects.length !== initialLength;
      return filteredProjects;
    });

    if (deleted) {
      this.storageService.store(this.STORAGE_KEY, this.projects());
    }

    return deleted;
  }
}
