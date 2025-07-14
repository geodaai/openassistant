# Contributing to OpenAssistant

Thank you for your interest in contributing to OpenAssistant! This document provides guidelines and information for contributors.

## Code of Conduct

OpenAssistant is an [OpenJS Foundation](https://openjsf.org/) project. Please be mindful of and adhere to the OpenJS Foundation's [Code of Conduct](https://github.com/openjs-foundation/cross-project-council/blob/main/CODE_OF_CONDUCT.md) when contributing to OpenAssistant.

## Developer Certificate of Origin (DCO)

OpenAssistant requires all contributors to sign their commits with a Developer Certificate of Origin (DCO). This certifies that you have the right to submit your contribution to the project.

### What is DCO?

The Developer Certificate of Origin is a way for contributors to certify that they have the right to submit their code contributions to the project. It's a simple way to ensure that all contributions are properly licensed and that contributors have the necessary rights to make their contributions.

### How to Sign Your Commits

You must add a `Signed-off-by` line to your commit messages. Here are several ways to do this:

#### Option 1: Automatic Sign-off with Git

Use the `-s` flag when committing:

```bash
git commit -s -m "Your commit message"
```

#### Option 2: Configure Git for Automatic Sign-off

You can configure Git to automatically add the sign-off line to all your commits:

```bash
git config --global format.signoff true
```

### Verification

The DCO bot will automatically check your pull requests to ensure all commits are properly signed. If any commits are missing the sign-off, the bot will provide instructions on how to fix them.

For more information about DCO, see the [DCO.md](../DCO.md) file in the root of this repository.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Yarn or npm
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/openassistant.git
   cd openassistant
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Build the project:
   ```bash
   yarn build
   ```
5. Run lint:
   ```bash
   yarn lint
   ```

## Making Changes

### Branch Naming

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### Commit Messages

Follow these guidelines for commit messages:

1. Use the present tense ("Add feature" not "Added feature")
2. Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
3. Limit the first line to 72 characters or less
4. Reference issues and pull requests liberally after the first line
5. Include the DCO sign-off line

Example:

```
Add spatial weights calculation function

This commit adds a new function for calculating spatial weights
using contiguity-based methods.

Fixes #123
Signed-off-by: Xun Li<xun.li@example.com>
```

### Testing

TBW

### Code Style

- Follow the existing code style in the file you're modifying
- Use TypeScript for new JavaScript files
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Submitting Changes

### Pull Request Process

1. Ensure your branch is up to date with the main branch
2. Push your changes to your fork
3. Create a pull request
4. Fill out the pull request template
5. Ensure the DCO check passes
6. Wait for review and address any feedback

### Pull Request Guidelines

- Provide a clear description of the changes
- Reference any related issues
- Include tests for new functionality
- Update documentation if necessary
- Ensure all CI checks pass

## Documentation

When adding new features or changing existing ones, please update the relevant documentation:

- API documentation in the `website/` directory
- README files for new packages
- Example code in the `examples/` directory

## Getting Help

If you need help with your contribution:

1. Check the existing documentation
2. Look at existing issues and pull requests
3. Open a new issue with a clear description of your problem
4. Join the project's community channels (if available)

## License

By contributing to OpenAssistant, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to OpenAssistant!
