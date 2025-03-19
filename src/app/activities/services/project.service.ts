import { Injectable, inject } from '@angular/core';
import { ProjectRepository } from '../repositories/project.repository';
import { Project } from '../models/project.model';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectRepository = inject(ProjectRepository);

  getAllProjects(): Project[] {
    return this.projectRepository.getProjects();
  }

  getProject(id: string): Project | null {
    return this.projectRepository.getProject(id);
  }

  updateProject(id: string, projectData: Partial<Project>): Project | null {
    return this.projectRepository.updateProject(id, projectData);
  }

  createProject(project: Omit<Project, 'id'>): Project {
    const newProject: Project = { id: uuid(), ...project };
    return this.projectRepository.createProject(newProject);
  }

  deleteProject(id: string): boolean {
    return this.projectRepository.deleteProject(id);
  }
}
