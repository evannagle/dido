import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import { ProjectContext, Config } from './types';

export class ContextManager {
  private db: Database.Database;
  private configPath: string;

  constructor(storagePath?: string) {
    const didoDir = storagePath || path.join(process.env.HOME || '~', '.dido');

    if (!fs.existsSync(didoDir)) {
      fs.mkdirSync(didoDir, { recursive: true });
    }

    const dbPath = path.join(didoDir, 'dido.db');
    this.configPath = path.join(didoDir, 'config.json');
    this.db = new Database(dbPath);

    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_path TEXT UNIQUE NOT NULL,
        project_type TEXT,
        commit_style TEXT,
        last_analyzed TEXT NOT NULL,
        readme_content TEXT
      )
    `);
  }

  saveProjectContext(context: ProjectContext): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO projects (project_path, project_type, commit_style, last_analyzed, readme_content)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      context.projectPath,
      context.projectType || null,
      context.commitStyle || null,
      context.lastAnalyzed,
      context.readmeContent || null
    );
  }

  getProjectContext(projectPath: string): ProjectContext | null {
    const stmt = this.db.prepare(`
      SELECT * FROM projects WHERE project_path = ?
    `);

    const row = stmt.get(projectPath) as any;

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      projectPath: row.project_path,
      projectType: row.project_type,
      commitStyle: row.commit_style,
      lastAnalyzed: row.last_analyzed,
      readmeContent: row.readme_content
    };
  }

  saveConfig(config: Config): void {
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }

  getConfig(): Config {
    const defaultConfig: Config = {
      autoPush: false,
      model: 'claude-3-5-sonnet-20241022'
    };

    if (!fs.existsSync(this.configPath)) {
      return defaultConfig;
    }

    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      return { ...defaultConfig, ...JSON.parse(configData) };
    } catch {
      return defaultConfig;
    }
  }

  close(): void {
    this.db.close();
  }
}
