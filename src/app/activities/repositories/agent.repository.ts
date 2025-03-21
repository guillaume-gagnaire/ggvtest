import { Injectable, signal } from '@angular/core';
import { Agent } from '../models/agent.model';
import { addDays, format, startOfWeek, subWeeks } from 'date-fns';
import { StorageService } from '../../services/storage.service';
import { ActivityRepository } from './activity.repository';

@Injectable({
  providedIn: 'root',
})
export class AgentRepository {
  private readonly STORAGE_KEY = 'agents';
  private readonly DEMO_AGENTS: Agent[] = [
    {
      id: '1',
      name: 'James Bond',
      holidays: [],
      avatar: 'https://placecats.com/300/300',
    },
    {
      id: '2',
      name: 'Moneypenny',
      holidays: [],
      avatar: 'https://placecats.com/301/301',
    },
    {
      id: '3',
      name: 'Q',
      holidays: [],
      avatar: 'https://placecats.com/302/302',
    },
  ];

  private agents = signal<Agent[]>([]);

  constructor(
    private readonly storageService: StorageService,
    private readonly activityRepository: ActivityRepository
  ) {
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    const storedAgents = this.storageService.get(this.STORAGE_KEY);
    if (!storedAgents || storedAgents.length === 0) {
      const agents = this.DEMO_AGENTS;
      for (let i = 0; i < agents.length; i++) {
        const monday = subWeeks(
          startOfWeek(new Date(), { weekStartsOn: 1 }),
          i + 1
        );
        agents[i].holidays = [
          format(monday, 'yyyy-MM-dd'),
          format(addDays(monday, 1), 'yyyy-MM-dd'),
          format(addDays(monday, 2), 'yyyy-MM-dd'),
          format(addDays(monday, 3), 'yyyy-MM-dd'),
          format(addDays(monday, 4), 'yyyy-MM-dd'),
        ];
      }
      this.storageService.store(this.STORAGE_KEY, agents);
      this.agents.set(agents);
    } else {
      this.agents.set(storedAgents);
    }
  }

  getAgent(id: string): Agent | null {
    return this.agents().find((agent) => agent.id === id) ?? null;
  }

  getAgents(filter?: (agent: Agent) => boolean): Agent[] {
    return this.agents().filter(filter || (() => true));
  }

  createAgent(agent: Agent): Agent {
    this.agents.update((agents) => {
      return [...agents, agent];
    });

    this.storageService.store(this.STORAGE_KEY, this.agents());
    return agent;
  }

  updateAgent(id: string, agentData: Partial<Agent>): Agent | null {
    let updatedAgent: Agent | null = null;

    this.agents.update((agents) => {
      const index = agents.findIndex((agent) => agent.id === id);
      if (index === -1) return agents;

      updatedAgent = { ...agents[index], ...agentData };
      const updatedAgents = [...agents];
      updatedAgents[index] = updatedAgent;

      return updatedAgents;
    });

    if (updatedAgent) {
      this.storageService.store(this.STORAGE_KEY, this.agents());
    }

    return updatedAgent;
  }

  deleteAgent(id: string): boolean {
    let deleted = false;

    this.agents.update((agents) => {
      const initialLength = agents.length;
      const filteredAgents = agents.filter((agent) => agent.id !== id);
      deleted = filteredAgents.length !== initialLength;
      return filteredAgents;
    });

    if (deleted) {
      this.storageService.store(this.STORAGE_KEY, this.agents());
    }

    this.activityRepository.deleteActivities(
      (activity) => activity.agentId === id
    );

    return deleted;
  }
}
