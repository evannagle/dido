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

export interface RepoScanResult {
  path: string;
  name: string;
  hasChanges: boolean;
  fileCount: number;
  error?: string;
}

export interface RecursiveCommitSummary {
  total: number;
  committed: number;
  skipped: number;
  failed: number;
  pushed: number;
}

export interface SingleCommitResult {
  success: boolean;
  message?: string;
  error?: string;
}
