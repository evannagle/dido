# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-10-13

### Changed
- Default model switched from Sonnet to Haiku (`claude-haiku-4-5`) for 5x faster and cheaper commits
- Reduced diff size limit from 6000 to 4000 characters to prevent token overload
- Recent commit history reduced from 5 to 3 commits for efficiency
- README context reduced from 1000 to 500 characters
- Streamlined system prompt for faster processing

### Improved
- Better token management to reduce costs
- Faster commit message generation
- More efficient context handling

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
