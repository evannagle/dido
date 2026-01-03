import { Command } from 'commander';
import inquirer from 'inquirer';
import * as path from 'path';
import { GitOperations } from './git';
import { AICommitGenerator } from './ai';
import { ContextManager } from './context';
import { RepoDiscovery } from './discovery';
import {
  ProjectContext,
  RepoScanResult,
  RecursiveCommitSummary,
  SingleCommitResult,
} from './types';

export class DidoCLI {
  private program: Command;
  private git: GitOperations;
  private contextManager: ContextManager;

  constructor() {
    this.program = new Command();
    this.git = new GitOperations();
    this.contextManager = new ContextManager();
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name('dido')
      .description('AI-powered git commit assistant')
      .version('0.1.1');

    this.program
      .command('commit', { isDefault: true })
      .description('Stage all changes and create an AI-generated commit')
      .option('-p, --push', 'Push after committing')
      .option('-m, --message <message>', 'Use a custom message instead of AI generation')
      .option('-r, --recursive', 'Traverse child directories for git repos')
      .option('-d, --depth <number>', 'Max recursion depth (default: unlimited)', parseInt)
      .action(async (options) => {
        if (options.recursive) {
          await this.handleRecursiveCommit(options);
        } else {
          await this.handleCommit(options);
        }
      });

    this.program
      .command('init')
      .description('Initialize dido for this project')
      .action(async () => {
        await this.handleInit();
      });

    this.program
      .command('config')
      .description('Configure dido settings')
      .option('--api-key <key>', 'Set Anthropic API key')
      .option('--auto-push <boolean>', 'Enable/disable auto-push')
      .option('--model <model>', 'Set Claude model')
      .action(async (options) => {
        await this.handleConfig(options);
      });
  }

  private async handleCommit(options: { push?: boolean; message?: string }): Promise<void> {
    try {
      // Check if we're in a git repo
      if (!(await this.git.isGitRepository())) {
        console.error('Error: Not a git repository');
        process.exit(1);
      }

      // Check for changes
      const hasChanges = await this.git.hasChanges();

      if (!hasChanges) {
        // If --push flag is set and no changes, just push
        if (options.push) {
          console.log('No changes to commit, pushing...');
          await this.git.push();
          console.log('Pushed successfully!');
          return;
        }
        console.log('No changes to commit');
        return;
      }

      // Stage all changes
      console.log('Staging all changes...');
      await this.git.stageAll();

      // Get config
      const config = this.contextManager.getConfig();

      // Use environment variable as fallback for API key
      const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;

      // Check for API key if we're generating a message
      if (!options.message && !apiKey) {
        console.error('Error: Anthropic API key not configured.');
        console.error('Set it via: dido config --api-key YOUR_API_KEY');
        console.error('Or set ANTHROPIC_API_KEY environment variable');
        process.exit(1);
      }

      let commitMessage: string;

      if (options.message) {
        commitMessage = options.message;
      } else {
        // Generate AI commit message
        console.log('Analyzing changes...');

        const diff = await this.git.getDiff(true);
        const recentCommits = await this.git.getRecentCommits(10);
        const repoPath = await this.git.getRepositoryRoot();

        // Get or create project context
        let projectContext = this.contextManager.getProjectContext(repoPath);

        // Read README if exists
        const readmeContent = await this.git.readFile('README.md');

        // Initialize AI
        const ai = new AICommitGenerator(apiKey!, config.model);

        // If this is first time, analyze project
        if (!projectContext && readmeContent) {
          console.log('First time in this project, analyzing...');
          const status = await this.git.getStatus();
          const fileList = status.files.map(f => f.path);
          const projectType = await ai.analyzeProjectType(readmeContent, fileList);

          projectContext = {
            projectPath: repoPath,
            projectType,
            lastAnalyzed: new Date().toISOString(),
            readmeContent: readmeContent.slice(0, 2000)
          };

          this.contextManager.saveProjectContext(projectContext);
        }

        const analysis = await ai.generateCommitMessage(
          diff,
          recentCommits,
          projectContext,
          readmeContent
        );

        commitMessage = analysis.message;

        console.log('\nGenerated commit message:');
        console.log(`  "${commitMessage}"\n`);

        // Confirm
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Proceed with this commit message?',
            default: true
          }
        ]);

        if (!confirm) {
          console.log('Commit cancelled');
          return;
        }
      }

      // Commit
      console.log('Creating commit...');
      await this.git.commit(commitMessage);
      console.log('Committed successfully!');

      // Push if requested or configured
      const shouldPush = options.push || config.autoPush;

      if (shouldPush) {
        const { confirmPush } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmPush',
            message: 'Push to remote?',
            default: true
          }
        ]);

        if (confirmPush) {
          console.log('Pushing...');
          await this.git.push();
          console.log('Pushed successfully!');
        }
      }

    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }

  private async handleInit(): Promise<void> {
    try {
      if (!(await this.git.isGitRepository())) {
        console.error('Error: Not a git repository');
        process.exit(1);
      }

      const repoPath = await this.git.getRepositoryRoot();
      const readmeContent = await this.git.readFile('README.md');

      console.log('Initializing dido for this project...');

      const config = this.contextManager.getConfig();

      // Use environment variable as fallback for API key
      const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;

      if (!apiKey) {
        console.error('Error: Anthropic API key not configured.');
        console.error('Set it via: dido config --api-key YOUR_API_KEY');
        console.error('Or set ANTHROPIC_API_KEY environment variable');
        process.exit(1);
      }

      if (readmeContent) {
        const ai = new AICommitGenerator(apiKey, config.model);
        const status = await this.git.getStatus();
        const fileList = status.files.map(f => f.path);

        console.log('Analyzing project...');
        const projectType = await ai.analyzeProjectType(readmeContent, fileList);

        const projectContext: ProjectContext = {
          projectPath: repoPath,
          projectType,
          lastAnalyzed: new Date().toISOString(),
          readmeContent: readmeContent.slice(0, 2000)
        };

        this.contextManager.saveProjectContext(projectContext);

        console.log(`Project initialized as: ${projectType}`);
      } else {
        console.log('No README found, basic initialization completed.');
      }

    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }

  private async handleConfig(options: { apiKey?: string; autoPush?: string; model?: string }): Promise<void> {
    try {
      const config = this.contextManager.getConfig();

      if (options.apiKey) {
        config.apiKey = options.apiKey;
        console.log('API key saved');
      }

      if (options.autoPush) {
        config.autoPush = options.autoPush.toLowerCase() === 'true';
        console.log(`Auto-push ${config.autoPush ? 'enabled' : 'disabled'}`);
      }

      if (options.model) {
        config.model = options.model;
        console.log(`Model set to: ${config.model}`);
      }

      this.contextManager.saveConfig(config);

      // Show current config
      if (!options.apiKey && !options.autoPush && !options.model) {
        console.log('Current configuration:');
        console.log(`  API Key: ${config.apiKey ? '***' + config.apiKey.slice(-4) : 'not set'}`);
        console.log(`  Auto-push: ${config.autoPush}`);
        console.log(`  Model: ${config.model}`);
      }

    } catch (error: any) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }

  private async handleRecursiveCommit(options: {
    push?: boolean;
    message?: string;
    depth?: number;
  }): Promise<void> {
    const discovery = new RepoDiscovery();
    const basePath = process.cwd();
    const maxDepth = options.depth ?? -1;

    console.log('Scanning for git repositories...');
    const repoPaths = discovery.findRepositories(basePath, maxDepth);

    if (repoPaths.length === 0) {
      console.log('No git repositories found.');
      return;
    }

    // Scan each repo for changes
    const scanResults: RepoScanResult[] = [];
    for (const repoPath of repoPaths) {
      const git = new GitOperations(repoPath);
      const relativePath = './' + path.relative(basePath, repoPath);
      const name = path.basename(repoPath);

      try {
        const hasChanges = await git.hasChanges();
        let fileCount = 0;
        if (hasChanges) {
          const status = await git.getStatus();
          fileCount = status.files.length;
        }
        scanResults.push({ path: repoPath, name, hasChanges, fileCount });
      } catch (error: any) {
        scanResults.push({
          path: repoPath,
          name,
          hasChanges: false,
          fileCount: 0,
          error: error.message,
        });
      }
    }

    // Display summary table
    console.log(`\nFound ${scanResults.length} repositories:\n`);
    console.log('  Repository                      Changed      Status');
    console.log('  ' + '-'.repeat(60));

    for (const result of scanResults) {
      const relativePath = './' + path.relative(basePath, result.path);
      const displayPath = relativePath.length > 30
        ? '...' + relativePath.slice(-27)
        : relativePath.padEnd(30);

      if (result.error) {
        console.log(`  ${displayPath}  ${'error'.padEnd(10)}   ${result.error}`);
      } else if (result.hasChanges) {
        const fileText = result.fileCount === 1 ? '1 file' : `${result.fileCount} files`;
        console.log(`  ${displayPath}  ${fileText.padEnd(10)}   ready`);
      } else {
        console.log(`  ${displayPath}  ${'0 files'.padEnd(10)}   no changes`);
      }
    }

    // Filter to repos with changes
    const reposWithChanges = scanResults.filter((r) => r.hasChanges && !r.error);

    if (reposWithChanges.length === 0) {
      console.log('\nNo repositories have changes to commit.');
      return;
    }

    console.log(`\nProcessing ${reposWithChanges.length} repositories with changes...\n`);

    // Process each repo
    const summary: RecursiveCommitSummary = {
      total: scanResults.length,
      committed: 0,
      skipped: scanResults.length - reposWithChanges.length,
      failed: 0,
      pushed: 0,
    };

    const committedRepos: string[] = [];

    for (let i = 0; i < reposWithChanges.length; i++) {
      const result = reposWithChanges[i];
      const relativePath = './' + path.relative(basePath, result.path);
      console.log(`[${i + 1}/${reposWithChanges.length}] ${relativePath}`);

      const commitResult = await this.performSingleCommit(result.path, {
        message: options.message,
        skipPush: true, // We'll batch pushes at the end
      });

      if (commitResult.success) {
        summary.committed++;
        committedRepos.push(result.path);
        console.log('  Committed!\n');
      } else if (commitResult.error === 'cancelled') {
        console.log('  Skipped.\n');
      } else {
        summary.failed++;
        console.log(`  Failed: ${commitResult.error}\n`);
      }
    }

    // Handle push if requested
    if (options.push && committedRepos.length > 0) {
      const { confirmPush } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmPush',
          message: `Push ${committedRepos.length} repositories to remote?`,
          default: true,
        },
      ]);

      if (confirmPush) {
        console.log('\nPushing...');
        for (const repoPath of committedRepos) {
          const relativePath = './' + path.relative(basePath, repoPath);
          try {
            const git = new GitOperations(repoPath);
            await git.push();
            summary.pushed++;
            console.log(`  ${relativePath} - pushed`);
          } catch (error: any) {
            console.log(`  ${relativePath} - failed: ${error.message}`);
          }
        }
      }
    }

    // Final summary
    console.log('\nSummary:');
    console.log(`  Total repositories:  ${summary.total}`);
    console.log(`  Committed:           ${summary.committed}`);
    console.log(`  Skipped:             ${summary.skipped}`);
    console.log(`  Failed:              ${summary.failed}`);
    if (options.push) {
      console.log(`  Pushed:              ${summary.pushed}`);
    }
  }

  private async performSingleCommit(
    repoPath: string,
    options: { message?: string; skipPush?: boolean }
  ): Promise<SingleCommitResult> {
    const git = new GitOperations(repoPath);

    try {
      // Stage all changes
      console.log('  Staging changes...');
      await git.stageAll();

      // Get config
      const config = this.contextManager.getConfig();
      const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;

      let commitMessage: string;

      if (options.message) {
        commitMessage = options.message;
      } else {
        if (!apiKey) {
          return { success: false, error: 'API key not configured' };
        }

        console.log('  Analyzing changes...');

        const diff = await git.getDiff(true);
        const recentCommits = await git.getRecentCommits(10);

        // Get or create project context
        let projectContext = this.contextManager.getProjectContext(repoPath);
        const readmeContent = await git.readFile('README.md');

        const ai = new AICommitGenerator(apiKey, config.model);

        if (!projectContext && readmeContent) {
          const status = await git.getStatus();
          const fileList = status.files.map((f) => f.path);
          const projectType = await ai.analyzeProjectType(readmeContent, fileList);

          projectContext = {
            projectPath: repoPath,
            projectType,
            lastAnalyzed: new Date().toISOString(),
            readmeContent: readmeContent.slice(0, 2000),
          };

          this.contextManager.saveProjectContext(projectContext);
        }

        const analysis = await ai.generateCommitMessage(
          diff,
          recentCommits,
          projectContext,
          readmeContent
        );

        commitMessage = analysis.message;

        console.log(`  Generated: "${commitMessage}"`);

        // Confirm
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: '  Proceed?',
            default: true,
          },
        ]);

        if (!confirm) {
          return { success: false, error: 'cancelled' };
        }
      }

      // Commit
      await git.commit(commitMessage);

      return { success: true, message: commitMessage };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async run(): Promise<void> {
    await this.program.parseAsync(process.argv);
    this.contextManager.close();
  }
}
