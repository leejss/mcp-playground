# MCP Playground

A playground for experimenting with Model Context Protocol (MCP).

## Getting Started

### Prerequisites

- Node.js v16+
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Environment Setup

This project uses dotenv for environment variable management. You need to set up a `.env` file with your API keys:

1. Create a `.env` file in the project root (or copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Anthropic API key:

   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

## Running Tests

To test the `selectBestTool` function:

```bash
# Run all tests
npx tsx src/test-select-best-tool.ts

# Run only example tests
npx tsx src/test-select-best-tool.ts --examples

# Run only custom input test
npx tsx src/test-select-best-tool.ts --custom

# Run with specific input
npx tsx src/test-select-best-tool.ts --custom --input="서울 날씨 어때?"
```

## Development

### Formatting Code

```bash
# Format all TypeScript files
npm run format

# Check formatting without making changes
npm run format:check
```

## Project Structure

- `src/` - Source code
  - `host.ts` - MCP Host implementation
  - `config.ts` - Environment configuration
  - `test-select-best-tool.ts` - Tests for selectBestTool function
  - `selectBestTool-examples.ts` - Test examples
- `.env` - Environment variables (not committed to git)
- `.env.example` - Example environment variables file
