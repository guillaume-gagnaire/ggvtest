import { Agent } from './agent.model';
import { Project } from './project.model';

export interface Activity {
  id: string;
  agentId: string;
  projectId: string;
  date: string;
}

export type PopulatedActivity = Activity & {
  agent: Agent | null;
  project: Project | null;
};

export interface MacroMonth {
  weeks: MacroWeek[];
}

export interface MacroWeek {
  days: MacroDay[];
}

export interface MacroDay {
  date: string | null;
}
