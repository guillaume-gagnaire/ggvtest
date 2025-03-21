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
import { Agent } from '../../models/agent.model';
import { AgentService } from '../../services/agent.service';
import { format, parse } from 'date-fns';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-agents-page',
  templateUrl: './agents.page.html',
  styleUrl: './agents.page.css',
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
    CalendarModule,
  ],
  providers: [ConfirmationService],
})
export class AgentsPage {
  constructor(
    private agentService: AgentService,
    private confirmationService: ConfirmationService
  ) {}

  appStore = inject(AppStore);

  items = signal<Agent[]>([]);

  editedAgentId: string | null = null;
  editingAgent = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    holidays: new FormControl<Date[]>(
      [],
      [Validators.required, Validators.max(5)]
    ),
    avatar: new FormControl('', [Validators.required]),
  });

  editAgent(agent: Agent) {
    this.editedAgentId = agent.id;
    this.form.patchValue({
      name: agent.name,
      holidays: agent.holidays.map((holiday) =>
        parse(holiday, 'yyyy-MM-dd', new Date())
      ),
      avatar: agent.avatar,
    });
    this.editingAgent = true;
  }

  createAgent() {
    this.editedAgentId = null;
    this.form.patchValue({
      name: '',
      holidays: [],
      avatar: '',
    });
    this.editingAgent = true;
  }

  deleteAgent(agent: Agent) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cet agent ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.agentService.deleteAgent(agent.id);
        this.items.update(() => this.agentService.getAgents());
      },
    });
  }

  async saveAgent() {
    if (!this.form.valid) {
      return;
    }

    if (this.editedAgentId) {
      this.agentService.updateAgent(this.editedAgentId, {
        name: this.form.value.name ?? '',
        holidays: (this.form.value.holidays ?? []).map((holiday) =>
          format(holiday, 'yyyy-MM-dd')
        ),
        avatar: this.form.value.avatar ?? '',
      });
    } else {
      this.agentService.createAgent({
        name: this.form.value.name ?? '',
        holidays: (this.form.value.holidays ?? []).map((holiday) =>
          format(holiday, 'yyyy-MM-dd')
        ),
        avatar: this.form.value.avatar ?? '',
      });
    }
    this.items.update(() => this.agentService.getAgents());
    this.editingAgent = false;
    this.form.reset();
  }

  ngOnInit() {
    this.appStore.setMeta('Agents', 'agents');
    this.items.update(() => this.agentService.getAgents());
  }
}
