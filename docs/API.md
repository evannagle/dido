# API Documentation

## CLI Commands

### `dido` (default)

Stages all changes and creates an AI-generated commit.

**Usage:**
```bash
dido
dido commit
```

**Options:**
- `-p, --push` - Push to remote after committing
- `-m, --message <message>` - Use custom message instead of AI generation

**Examples:**
```bash
# Basic AI commit
dido

# Commit with custom message
dido -m "Fix authentication bug"

# Commit and push
dido --push
```

**Workflow:**
1. Validates git repository
2. Checks for changes
3. Stages all files (`git add .`)
4. Gets API key (config or env var)
5. Generates commit message with AI
6. Shows preview and asks for confirmation
7. Creates commit
8. Optionally pushes to remote

---

### `dido init`

Initializes Dido for the current project, analyzing README and project structure.

**Usage:**
```bash
dido init
```

**What it does:**
- Analyzes README.md content
- Detects project type
- Stores project context in `~/.dido/dido.db`
- Prepares for future intelligent commits

**Requirements:**
- Must be in a git repository
- API key must be configured

---

### `dido config`

Manages Dido configuration.

**Usage:**
```bash
# View current config
dido config

# Set API key
dido config --api-key YOUR_KEY

# Enable auto-push
dido config --auto-push true

# Disable auto-push
dido config --auto-push false

# Change model
dido config --model claude-3-5-sonnet-20241022
```

**Options:**
- `--api-key <key>` - Set Anthropic API key
- `--auto-push <boolean>` - Enable/disable automatic pushing
- `--model <model>` - Set Claude model to use

**Configuration Location:**
`~/.dido/config.json`

---

## TypeScript API

### GitOperations

```typescript
class GitOperations {
  constructor(repoPath?: string)

  async isGitRepository(): Promise<boolean>
  async getStatus(): Promise<StatusResult>
  async stageAll(): Promise<void>
  async getDiff(staged?: boolean): Promise<string>
  async getRecentCommits(count?: number): Promise<string[]>
  async commit(message: string): Promise<void>
  async push(): Promise<void>
  async getRepositoryRoot(): Promise<string>
  async hasChanges(): Promise<boolean>
  async getStagedChanges(): Promise<{
    files: number;
    insertions: number;
    deletions: number;
  }>
  getRepoPath(): string
  async readFile(relPath: string): Promise<string | null>
}
```

### AICommitGenerator

```typescript
class AICommitGenerator {
  constructor(apiKey: string, model?: string)

  async generateCommitMessage(
    diff: string,
    recentCommits: string[],
    projectContext: ProjectContext | null,
    readmeContent: string | null
  ): Promise<CommitAnalysis>

  async analyzeProjectType(
    readmeContent: string,
    fileList: string[]
  ): Promise<string>
}
```

### ContextManager

```typescript
class ContextManager {
  constructor(storagePath?: string)

  saveProjectContext(context: ProjectContext): void
  getProjectContext(projectPath: string): ProjectContext | null
  saveConfig(config: Config): void
  getConfig(): Config
  close(): void
}
```

### Types

```typescript
interface ProjectContext {
  id?: number;
  projectPath: string;
  projectType?: string;
  commitStyle?: string;
  lastAnalyzed: string;
  readmeContent?: string;
}

interface CommitAnalysis {
  message: string;
  reasoning: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

interface Config {
  apiKey?: string;
  autoPush: boolean;
  model: string;
}
```

---

## Environment Variables

### ANTHROPIC_API_KEY

Dido checks for the Anthropic API key in this order:
1. Configuration file (`~/.dido/config.json`)
2. Environment variable (`ANTHROPIC_API_KEY`)

**Setting:**
```bash
# Bash/Zsh
export ANTHROPIC_API_KEY=your_key_here

# Add to ~/.bashrc or ~/.zshrc for persistence
echo 'export ANTHROPIC_API_KEY=your_key_here' >> ~/.zshrc
```

---

## Storage

### Database Location
`~/.dido/dido.db`

SQLite database storing:
- Project contexts
- Project types
- Commit styles
- README content
- Last analysis timestamps

### Config Location
`~/.dido/config.json`

JSON file storing:
- API key (if set via config)
- Auto-push preference
- Model selection

---

## Models

Dido supports all Claude models via Anthropic API:

- `claude-3-5-sonnet-20241022` (default, recommended)
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`

**Changing model:**
```bash
dido config --model claude-3-opus-20240229
```

---

## Error Handling

Common errors and solutions:

**"Not a git repository"**
- Run `git init` first
- Ensure you're in the correct directory

**"Anthropic API key not configured"**
- Set via: `dido config --api-key YOUR_KEY`
- Or: `export ANTHROPIC_API_KEY=YOUR_KEY`

**"No changes to commit"**
- Make some changes first
- Check `git status`

**"AI generation failed"**
- Check API key validity
- Check internet connection
- Verify API quota/credits

---

## Exit Codes

- `0` - Success
- `1` - Error (see error message)
