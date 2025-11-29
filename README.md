# Material UI MCP Server

A Model Context Protocol (MCP) server providing comprehensive access to the [Material UI](https://mui.com/material-ui/) component library documentation. Deploy this MCP to help AI assistants like Claude Code build consistent, well-designed React applications using Material UI components.

## 🚀 Quick Deploy

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jgentes/mui-mcp-cloudflare)

This will deploy your Material UI MCP server to a URL like: `mui-mcp.<your-account>.workers.dev/sse`

## 📋 What This MCP Provides

This MCP server gives AI assistants instant access to Material UI's 50+ React components with 6 specialized tools:

### Available Tools

1. **`list_components`** - Browse all 50+ available Material UI components
2. **`get_component_info`** - Get component details, imports, and documentation links
3. **`search_components`** - Find components by use case (forms, navigation, feedback, etc.)
4. **`get_customization_guide`** - Learn Material UI's theming and styling system
5. **`get_setup_guide`** - Installation and setup instructions for Material UI
6. **`get_mui_guide`** - Comprehensive guide to Material UI documentation and best practices

### Component Categories

- **Inputs**: Text Field, Select, Checkbox, Radio Button, Switch, Slider, Autocomplete
- **Data Display**: Table, List, Typography, Avatar, Badge, Chip, Tooltip, Timeline
- **Feedback**: Alert, Dialog, Progress, Snackbar, Skeleton, Backdrop
- **Surfaces**: Card, Paper, Accordion
- **Navigation**: App Bar, Drawer, Tabs, Breadcrumbs, Menu, Stepper, Bottom Navigation
- **Layout**: Box, Container, Grid, Stack, Image List, Masonry
- **Utils**: Click Away Listener, CSS Baseline, Portal
- **And more**: 50+ production-ready components

## 🔌 Installation

### Option 1: Quick Start (if you don't want to deploy to Cloudflare or run your own locally)

Use the public Material UI MCP server to get started immediately:

**Claude Code:**
```bash
claude mcp add mui npx mcp-remote https://mui-mcp-cloudflare.jgentes.workers.dev/sse
```

**Cursor:**

**Install in Cursor:**

To install the Material UI MCP Server in Cursor, copy and paste the following link into your browser's address bar:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=mui&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJtY3AtcmVtb3RlIiwiaHR0cHM6Ly9tdWktbWNwLWNsb3VkZmxhcmUuamdlbnRlcy53b3JrZXJzLmRldi9zc2UiXX0=
```

Or manually add to your Cursor settings:

```json
{
  "mcpServers": {
    "mui": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mui-mcp-cloudflare.jgentes.workers.dev/sse"
      ]
    }
  }
}
```

### Option 2: Deploy Your Own

Deploy your own instance to Cloudflare Workers:

1. Click the "Deploy to Cloudflare Workers" button at the top
2. After deployment, your MCP will be available at: `https://mui-mcp-cloudflare.<your-account>.workers.dev/sse`
3. Connect to Claude Code:

```bash
claude mcp add mui npx mcp-remote https://mui-mcp-cloudflare.<your-account>.workers.dev/sse
```

Or manually edit your config:

```json
{
  "mcpServers": {
    "mui": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mui-mcp-cloudflare.<your-account>.workers.dev/sse"
      ]
    }
  }
}
```

### Option 3: Local Server

For running using the Wrangler CLI:

```bash
# Install dependencies
npm install

# Run locally (starts on http://localhost:8787)
npm run dev
```

Connect to your local instance:

**Claude Code:**
```bash
claude mcp add mui npx mcp-remote http://localhost:8787/sse
```

**Manual config:**
```json
{
  "mcpServers": {
    "mui": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8787/sse"
      ]
    }
  }
}
```

## 🛠️ How It Works

This MCP server fetches documentation directly from [mui.com](https://mui.com/material-ui/) and provides structured information to AI assistants. It helps ensure:

- ✅ **Consistency** - Correct Material UI component usage across projects
- ✅ **Efficiency** - Quick component discovery prevents unnecessary custom development
- ✅ **Accuracy** - Direct access to official documentation ensures proper implementation
- ✅ **Customization** - Full support for Material UI's theming and styling system
- ✅ **Best Practices** - Includes accessibility guidelines and proper usage patterns

## 📚 Example Usage

When connected to Claude Code, you can ask questions like:

- "List all available Material UI components"
- "Show me how to use the Button component"
- "Find components for building forms"
- "How do I set up Material UI theming?"
- "What's the best way to customize Material UI components?"
- "Show me data display components"

The MCP will provide accurate, up-to-date information with direct links to the official Material UI documentation.

## 🔧 Customization

To modify the MCP server, edit [src/index.ts](src/index.ts):

- Update component lists in the `COMPONENTS` constant
- Add new tools using `this.server.tool(...)`
- Modify search categories in `COMPONENT_MAP`
- Enhance documentation extraction methods

## 📦 Versioning & Releases

This project uses [release-it](https://github.com/release-it/release-it) with conventional changelog for versioning.

### For Maintainers

To create a new release:

```bash
npm run release
```

This will:
1. Prompt you to select version bump (patch/minor/major)
2. Update package.json version
3. Generate/update CHANGELOG.md from commit messages
4. Create a git tag
5. Push changes to GitHub
6. Create a GitHub release

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format for automatic changelog generation:

- `feat: add new component tool` - New features (minor version bump)
- `fix: correct component URL` - Bug fixes (patch version bump)
- `docs: update installation guide` - Documentation changes
- `chore: update dependencies` - Maintenance tasks
- `BREAKING CHANGE:` in commit body - Breaking changes (major version bump)

See [CHANGELOG.md](./CHANGELOG.md) for release history.

## 📄 License

MIT

## 🙏 Credits

- Built with [Cloudflare Workers](https://workers.cloudflare.com/)
- Documentation from [Material UI](https://mui.com/material-ui/)
- Implements the [Model Context Protocol](https://modelcontextprotocol.io/)
