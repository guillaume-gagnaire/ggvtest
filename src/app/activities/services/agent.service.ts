import { Injectable } from '@angular/core';
import { AgentRepository } from '../repositories/agent.repository';
import { Agent } from '../models/agent.model';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(private readonly agentRepository: AgentRepository) {}

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
    this.agentRepository.deleteAgent(id);
  }
}
