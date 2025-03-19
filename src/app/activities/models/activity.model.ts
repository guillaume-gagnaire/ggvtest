import { Agent } from './agent.model';
import { Project } from './project.model';

export type Activity = {
  id: string;
  agentId: string;
  projectId: string;
  date: string;
};

export type PopulatedActivity = Activity & {
  agent: Agent | null;
  project: Project | null;
};
