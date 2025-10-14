# Installation Guide

## Global Installation (Recommended)

### Option 1: From npm (once published)

```bash
npm install -g dido
```

### Option 2: From source (for development)

```bash
# Clone the repository
git clone https://github.com/yourusername/dido.git
cd dido

# Install dependencies
npm install

# Build the project
npm run build

# Link globally
npm link

# Now you can use `dido` from anywhere
dido --help
```

## Local Installation (Project-specific)

```bash
npm install --save-dev dido
```

Then run via npx:

```bash
npx dido
```

Or add to your package.json scripts:

```json
{
  "scripts": {
    "commit": "dido"
  }
}
```

## Configuration

After installation, configure your Anthropic API key:

```bash
dido config --api-key YOUR_ANTHROPIC_API_KEY
```

Get your API key from: https://console.anthropic.com/

## Verification

Test that dido is working:

```bash
dido --help
dido config
```

## Uninstallation

### Global

```bash
npm uninstall -g dido
```

### Local

```bash
npm uninstall dido
```

## Troubleshooting

### Permission errors on global install

Try using sudo (macOS/Linux):

```bash
sudo npm install -g dido
```

Or configure npm to use a different directory:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### "Not a git repository" error

Make sure you're running dido inside a git repository:

```bash
git init
```

### API key issues

Ensure your API key is properly configured:

```bash
dido config --api-key YOUR_KEY
dido config  # Verify it's set
```
