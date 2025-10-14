import simpleGit, { SimpleGit, DiffResult, StatusResult } from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';

export class GitOperations {
  private git: SimpleGit;
  private repoPath: string;

  constructor(repoPath: string = process.cwd()) {
    this.repoPath = repoPath;
    this.git = simpleGit(repoPath);
  }

  async isGitRepository(): Promise<boolean> {
    try {
      await this.git.revparse(['--git-dir']);
      return true;
    } catch {
      return false;
    }
  }

  async getStatus(): Promise<StatusResult> {
    return await this.git.status();
  }

  async stageAll(): Promise<void> {
    await this.git.add('.');
  }

  async getDiff(staged: boolean = true): Promise<string> {
    if (staged) {
      return await this.git.diff(['--staged']);
    }
    return await this.git.diff();
  }

  async getRecentCommits(count: number = 10): Promise<string[]> {
    const log = await this.git.log({ maxCount: count });
    return log.all.map(commit => commit.message);
  }

  async commit(message: string): Promise<void> {
    await this.git.commit(message);
  }

  async push(): Promise<void> {
    await this.git.push();
  }

  async getRepositoryRoot(): Promise<string> {
    const root = await this.git.revparse(['--show-toplevel']);
    return root.trim();
  }

  async hasChanges(): Promise<boolean> {
    const status = await this.getStatus();
    return status.files.length > 0;
  }

  async getStagedChanges(): Promise<{ files: number; insertions: number; deletions: number }> {
    const diff = await this.git.diffSummary(['--staged']);
    return {
      files: diff.files.length,
      insertions: diff.insertions,
      deletions: diff.deletions
    };
  }

  getRepoPath(): string {
    return this.repoPath;
  }

  async readFile(relPath: string): Promise<string | null> {
    try {
      const fullPath = path.join(this.repoPath, relPath);
      if (fs.existsSync(fullPath)) {
        return fs.readFileSync(fullPath, 'utf-8');
      }
      return null;
    } catch {
      return null;
    }
  }
}
