import * as fs from 'fs';
import * as path from 'path';

const SKIP_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  'vendor',
  'dist',
  'build',
  '.next',
  '.nuxt',
  'coverage',
  '__pycache__',
  '.venv',
  'venv',
]);

export class RepoDiscovery {
  /**
   * Find all git repositories under a given path
   * @param basePath - Starting directory
   * @param maxDepth - Maximum recursion depth (-1 for unlimited)
   * @returns Array of absolute paths to git repository roots
   */
  findRepositories(basePath: string, maxDepth: number = -1): string[] {
    const repos: string[] = [];
    const absoluteBase = path.resolve(basePath);

    this.walkDirectory(absoluteBase, 0, maxDepth, repos);

    return repos.sort();
  }

  private walkDirectory(
    dirPath: string,
    currentDepth: number,
    maxDepth: number,
    repos: string[]
  ): void {
    // Check depth limit (-1 means unlimited)
    if (maxDepth !== -1 && currentDepth > maxDepth) {
      return;
    }

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      // Permission denied or other error - skip this directory
      return;
    }

    // Check if this directory is a git repo
    const hasGitDir = entries.some(
      (entry) => entry.isDirectory() && entry.name === '.git'
    );

    if (hasGitDir) {
      repos.push(dirPath);
      // Don't recurse into git repos - they're already found
      return;
    }

    // Recurse into subdirectories
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (SKIP_DIRECTORIES.has(entry.name)) {
        continue;
      }

      // Skip hidden directories (except we already checked .git above)
      if (entry.name.startsWith('.')) {
        continue;
      }

      const subPath = path.join(dirPath, entry.name);
      this.walkDirectory(subPath, currentDepth + 1, maxDepth, repos);
    }
  }
}
