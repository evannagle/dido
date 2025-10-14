# Usage Examples

## Basic Workflows

### First Time Setup

```bash
# Install globally
npm install -g dido

# Configure API key
dido config --api-key sk-ant-...

# Navigate to your project
cd ~/projects/my-app

# Initialize dido for this project
dido init
```

### Daily Workflow

```bash
# Make some changes to your code
vim src/app.ts

# Stage and commit with AI
dido

# Output:
# Staging all changes...
# Analyzing changes...
#
# Generated commit message:
#   "Add user authentication middleware"
#
# ? Proceed with this commit message? (Y/n)
```

### Quick Commit and Push

```bash
# Make changes
vim README.md

# Commit and push in one command
dido --push

# Dido will ask for push confirmation
```

### Override AI with Custom Message

```bash
# When you know exactly what to say
dido -m "WIP: experimenting with new API"
```

---

## Project-Specific Examples

### Node.js Project

```bash
cd my-node-app

# Add a new feature
vim src/features/payments.js

dido
# Generates: "feat: add Stripe payment integration"
```

### Bug Fix

```bash
# Fix a bug
vim src/utils/validation.js

dido
# Generates: "fix: handle null values in email validator"
```

### Documentation

```bash
# Update docs
vim README.md
vim docs/installation.md

dido
# Generates: "docs: update installation instructions and README"
```

### Refactoring

```bash
# Refactor code
vim src/database/connection.js

dido
# Generates: "refactor: simplify database connection pooling"
```

---

## Advanced Usage

### Custom Model

```bash
# Use a different Claude model
dido config --model claude-3-opus-20240229

# Verify
dido config
```

### Auto-Push Enabled

```bash
# Enable auto-push for this machine
dido config --auto-push true

# Now every commit will prompt to push
dido
# After commit confirmation, also asks about pushing
```

### Environment-Based API Key

```bash
# Set API key via environment variable
export ANTHROPIC_API_KEY=sk-ant-...

# Add to shell profile for persistence
echo 'export ANTHROPIC_API_KEY=sk-ant-...' >> ~/.zshrc

# Now dido works without explicit config
dido
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Automated Commits
on: [workflow_dispatch]

jobs:
  commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Dido
        run: npm install -g dido

      - name: Configure Dido
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: dido config --api-key $ANTHROPIC_API_KEY

      - name: Make changes
        run: |
          # Your automated changes here
          npm run generate-docs

      - name: Commit with Dido
        run: dido -m "chore: automated documentation update"

      - name: Push
        run: git push
```

---

## Team Workflows

### Consistent Style Across Team

```bash
# Team member 1 makes commits
cd team-project
dido init

# Dido learns from existing commits
# Future commits match the established style

# Team member 2 clones and uses dido
git clone https://github.com/team/project
cd project
dido init

# Dido analyzes the same commit history
# Generates messages in the same style
```

### Project-Specific Conventions

If your project uses specific commit conventions, Dido will learn them:

```bash
# Existing commits in repo:
# - JIRA-123: Add user login
# - JIRA-124: Fix password reset
# - JIRA-125: Update dependencies

# After dido init and analyzing history
dido
# Generates: "JIRA-126: Implement email notifications"
```

---

## Troubleshooting Examples

### Large Diff Handling

```bash
# After making many changes
dido

# Dido automatically truncates large diffs
# Focuses on meaningful parts
# Still generates accurate message
```

### No README Projects

```bash
# Works fine without README
cd legacy-project  # No README.md

dido
# Still generates good commits
# Uses git history for style
```

### Multiple File Types

```bash
# Mixed changes
vim src/app.js
vim styles/main.css
vim README.md
rm old-file.txt

dido
# Generates: "feat: add dark mode theme with documentation"
```

---

## Comparison: Before & After

### Before Dido

```bash
git add .
git commit -m "updates"
git push

# Or worse:
git commit -m "asdf"
git commit -m "fix"
git commit -m "working now"
```

### After Dido

```bash
dido --push

# Generated messages:
# "feat: add user profile customization"
# "fix: resolve memory leak in WebSocket connection"
# "refactor: extract validation logic to separate module"
```

---

## Real-World Scenarios

### Morning Workflow

```bash
# Start your day
cd ~/work/project

# Review yesterday's work
git log --oneline -10

# Continue feature work
vim src/features/dashboard.tsx

# Multiple commits throughout the day
dido  # "feat: add dashboard chart components"

vim src/features/dashboard.tsx
dido  # "feat: implement real-time data updates for dashboard"

vim tests/dashboard.test.tsx
dido  # "test: add unit tests for dashboard components"

# End of day
dido --push  # Push all commits
```

### Hotfix Workflow

```bash
# Urgent bug reported
git checkout main
git pull
git checkout -b hotfix/login-error

# Fix the issue
vim src/auth/login.js

# Quick commit with AI
dido -m "hotfix: resolve null reference in login handler"

# Push and create PR
git push -u origin hotfix/login-error
gh pr create --title "Hotfix: Login error"
```

### Review Changes First

```bash
# Make changes
vim src/app.js

# Review what changed
git diff

# Commit with dido
dido

# Dido shows generated message
# You can accept or cancel and edit manually
```
