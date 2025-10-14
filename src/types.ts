export interface ProjectContext {
  id?: number;
  projectPath: string;
  projectType?: string;
  commitStyle?: string;
  lastAnalyzed: string;
  readmeContent?: string;
}

export interface CommitAnalysis {
  message: string;
  reasoning: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

export interface Config {
  apiKey?: string;
  autoPush: boolean;
  model: string;
}
