import { Component, inject, signal } from '@angular/core';
import { AppStore } from '../../../layouts/default/stores/app.store';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects.page.html',
  styleUrl: './projects.page.css',
  standalone: true,
  imports: [
    TableModule,
    AvatarModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ColorPickerModule,
  ],
  providers: [ConfirmationService],
})
export class ProjectsPage {
  constructor(
    private projectService: ProjectService,
    private confirmationService: ConfirmationService
  ) {}

  appStore = inject(AppStore);

  items = signal<Project[]>([]);

  editedProjectId: string | null = null;
  editingProject = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    textColor: new FormControl('', [Validators.required]),
  });

  editProject(project: Project) {
    this.editedProjectId = project.id;
    this.form.patchValue({
      name: project.name,
      color: project.color,
      textColor: project.textColor,
    });
    this.editingProject = true;
  }

  createProject() {
    this.editedProjectId = null;
    this.form.patchValue({
      name: '',
      color: '#dddddd',
      textColor: '#333333',
    });
    this.editingProject = true;
  }

  deleteProject(project: Project) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ce projet ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.projectService.deleteProject(project.id);
        this.items.update(() => this.projectService.getAllProjects());
      },
    });
  }

  async saveProject() {
    if (!this.form.valid) {
      return;
    }

    if (this.editedProjectId) {
      this.projectService.updateProject(this.editedProjectId, {
        name: this.form.value.name ?? '',
        color: this.form.value.color ?? '',
        textColor: this.form.value.textColor ?? '',
      });
    } else {
      this.projectService.createProject({
        name: this.form.value.name ?? '',
        color: this.form.value.color ?? '',
        textColor: this.form.value.textColor ?? '',
      });
    }
    this.items.update(() => this.projectService.getAllProjects());
    this.editingProject = false;
    this.form.reset();
  }

  ngOnInit() {
    this.appStore.setMeta('Projets', 'projects');
    this.items.update(() => this.projectService.getAllProjects());
  }
}
