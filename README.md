# Dido

> "What'd I do?" - AI-powered git commit assistant that gets smarter over time.

Dido uses Claude AI to analyze your git changes and generate meaningful, context-aware commit messages automatically. It learns from your project's history and conventions to match your style.

## Features

- **One-command commits**: `dido` stages all changes and creates an intelligent commit
- **Context-aware**: Learns from your project's README, commit history, and conventions
- **Smart analysis**: Detects project type and adapts commit messages accordingly
- **Style matching**: Follows your existing commit patterns (conventional commits, custom styles)
- **Optional auto-push**: Commit and push in one go
- **Project memory**: Remembers context across sessions for consistent commits

## Installation

```bash
npm install -g dido
```

Or install locally in your project:

```bash
npm install --save-dev dido
```

## Setup

1. Get an Anthropic API key from https://console.anthropic.com/

2. Configure dido with your API key (choose one method):

**Option A: Via dido config (recommended)**
```bash
dido config --api-key YOUR_API_KEY
```

**Option B: Environment variable**
```bash
export ANTHROPIC_API_KEY=your_api_key_here
```

Add this to your `~/.bashrc`, `~/.zshrc`, or equivalent to make it permanent.

3. (Optional) Initialize dido in your project to analyze and learn from it:

```bash
dido init
```

## Usage

### Basic commit

```bash
dido
```

This will:
1. Stage all changes (`git add .`)
2. Analyze the diff with AI
3. Generate a commit message
4. Prompt you to confirm
5. Create the commit

### Commit and push

```bash
dido --push
```

### Use a custom message (skip AI generation)

```bash
dido -m "Your custom commit message"
```

### Configuration options

```bash
# Set API key
dido config --api-key YOUR_KEY

# Enable auto-push (always push after committing)
dido config --auto-push true

# Change Claude model
dido config --model claude-3-5-sonnet-20241022

# View current config
dido config
```

## How It Works

### Intelligence & Learning

Dido stores project context in `~/.dido/`:
- **Project database**: Tracks project type, conventions, and patterns
- **Commit style learning**: Analyzes recent commits to match your style
- **README parsing**: Understands project purpose and context
- **Session memory**: Remembers insights across multiple commits

### AI Analysis

For each commit, Dido:
1. Analyzes staged changes with git diff
2. Reviews recent commit messages for style patterns
3. Considers project context (type, README, conventions)
4. Generates a concise, meaningful commit message
5. Presents it for your approval

### Smart Features

- Detects conventional commit patterns (feat:, fix:, chore:)
- Truncates large diffs intelligently
- Adapts to project-specific terminology
- Follows imperative mood conventions
- Keeps messages concise (50-72 characters ideal)

## Requirements

- Node.js >= 18.0.0
- Git repository
- Anthropic API key

## Project Structure

```
dido/
├── src/
│   ├── index.ts      # Entry point
│   ├── cli.ts        # CLI commands
│   ├── git.ts        # Git operations
│   ├── ai.ts         # AI integration
│   ├── context.ts    # Project intelligence
│   └── types.ts      # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start

# Watch mode
npm run dev
```

## License

MIT
