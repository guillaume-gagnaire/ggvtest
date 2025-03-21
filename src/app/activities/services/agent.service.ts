import { Injectable } from '@angular/core';
import { AgentRepository } from '../repositories/agent.repository';
import { Agent } from '../models/agent.model';
import { v4 as uuid } from 'uuid';
import { ActivityRepository } from '../repositories/activity.repository';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(
    private readonly agentRepository: AgentRepository,
    private readonly activityRepository: ActivityRepository
  ) {}

  getAgents(): Agent[] {
    return this.agentRepository.getAgents();
  }

  getAgent(id: string): Agent | null {
    return this.agentRepository.getAgent(id);
  }

  createAgent(agent: Omit<Agent, 'id'>): void {
    this.agentRepository.createAgent({
      id: uuid(),
      ...agent,
    });
  }

  updateAgent(id: string, agent: Partial<Agent>): void {
    this.agentRepository.updateAgent(id, agent);
  }

  deleteAgent(id: string): void {
    this.activityRepository.deleteActivities(
      (activity) => activity.agentId === id
    );
    this.agentRepository.deleteAgent(id);
  }
}
