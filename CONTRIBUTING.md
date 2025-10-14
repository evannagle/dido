# Contributing to Dido

Thank you for considering contributing to Dido! This document outlines the process and guidelines.

## Code of Conduct

Be respectful, professional, and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include:
   - Dido version (`dido --version`)
   - Node.js version (`node --version`)
   - Operating system
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/logs

### Suggesting Features

1. Check existing issues and discussions
2. Clearly describe the feature and use case
3. Explain why this benefits Dido users
4. Consider implementation complexity

### Pull Requests

#### Before Starting

1. Open an issue to discuss significant changes
2. Fork the repository
3. Create a feature branch from `main`

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/dido.git
cd dido

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link

# Test in another project
cd /path/to/test-project
dido
```

#### Code Guidelines

**TypeScript Standards**
- Use strict typing, avoid `any` when possible
- Define interfaces for complex types
- Use enums instead of magic strings
- Document complex logic with comments

**Code Style**
- Follow existing code patterns
- Use meaningful variable/function names
- Keep functions focused and small
- Write self-documenting code

**Commit Messages**
- Use conventional commits format
- Examples:
  - `feat: add commit template support`
  - `fix: handle empty git repositories`
  - `docs: update installation instructions`
  - `refactor: simplify diff truncation logic`
  - `test: add unit tests for AI module`

#### Testing Your Changes

```bash
# Build after changes
npm run build

# Test basic functionality
cd /path/to/test-repo
dido --help
dido config
dido

# Test edge cases
# - Empty repository
# - Large diffs
# - No README
# - Invalid API key
```

#### Submitting

1. Ensure code builds without errors
2. Test thoroughly with real git repositories
3. Update documentation if needed
4. Update CHANGELOG.md
5. Push to your fork
6. Open a pull request with:
   - Clear description of changes
   - Issue reference (if applicable)
   - Screenshots/examples (if relevant)

### Project Structure

```
dido/
├── src/
│   ├── index.ts      # Entry point, CLI initialization
│   ├── cli.ts        # Command definitions and handlers
│   ├── git.ts        # Git operations wrapper
│   ├── ai.ts         # Claude API integration
│   ├── context.ts    # Project intelligence storage
│   └── types.ts      # TypeScript interfaces
├── dist/             # Compiled JavaScript (gitignored)
├── node_modules/     # Dependencies (gitignored)
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── README.md         # User documentation
├── CONTRIBUTING.md   # This file
├── CHANGELOG.md      # Version history
├── LICENSE           # MIT license
└── INSTALL.md        # Installation guide
```

### Architecture Overview

**GitOperations** (`src/git.ts`)
- Wraps simple-git library
- Provides clean interface for git commands
- Handles repository validation
- Manages file reading from repo

**AICommitGenerator** (`src/ai.ts`)
- Interfaces with Anthropic API
- Generates commit messages from diffs
- Analyzes project type
- Handles prompt construction

**ContextManager** (`src/context.ts`)
- SQLite database management
- Project context persistence
- Configuration storage
- Learning from project patterns

**DidoCLI** (`src/cli.ts`)
- Commander command definitions
- Inquirer prompt management
- Orchestrates git, AI, and context modules
- Main application logic

### Areas for Contribution

**High Priority**
- Unit tests for core modules
- Integration tests
- Error handling improvements
- Performance optimization for large diffs

**Feature Ideas**
- Commit message templates
- Interactive edit mode
- `.didoignore` support
- Conventional commit scopes
- Multi-language commit messages
- Git hooks integration

**Documentation**
- Video tutorials
- Blog posts
- Use case examples
- API documentation

### Questions?

Open an issue with the "question" label or start a discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
