import { Injectable } from '@angular/core';
import { AgentRepository } from '../repositories/agent.repository';
import { Agent } from '../models/agent.model';

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
}
