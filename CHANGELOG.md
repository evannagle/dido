# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-13

### Added
- Initial release of Dido
- AI-powered commit message generation using Claude
- Automatic staging of all changes (`git add .`)
- Interactive commit confirmation
- Optional push functionality with `--push` flag
- Custom message override with `-m` flag
- Project context learning and storage
- README analysis for project understanding
- Commit history analysis for style matching
- Project type detection
- SQLite-based project intelligence storage in `~/.dido/`
- Configuration management via `dido config`
- Support for ANTHROPIC_API_KEY environment variable
- Project initialization command `dido init`
- Conventional commit pattern detection
- Smart diff truncation for large changes

### Features
- Commander-based CLI interface
- Inquirer prompts for user interaction
- Simple-git integration for git operations
- Anthropic SDK integration for AI analysis
- Better-sqlite3 for persistent storage
- TypeScript with strict typing
- Auto-push configuration option
- Model selection support

[0.1.0]: https://github.com/evannagle/dido/releases/tag/v0.1.0
