import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define our MCP agent with tools for Material UI
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Material UI Component Library",
		version: "1.0.0",
	});

	// All Material UI components extracted from llms.txt
	private readonly COMPONENTS = [
		"Accordion", "Alert", "App Bar", "Autocomplete", "Avatar", "Backdrop",
		"Badge", "Bottom Navigation", "Box", "Breadcrumbs", "Button", "Button Group",
		"Card", "Checkbox", "Chip", "Circular Progress", "Click Away Listener",
		"Container", "CSS Baseline", "Dialog", "Divider", "Drawer",
		"Floating Action Button", "Grid", "Image List", "Linear Progress", "Link",
		"List", "Masonry", "Menu", "Modal", "Pagination", "Paper", "Popover",
		"Popper", "Portal", "Radio Button", "Rating", "Select", "Skeleton",
		"Slider", "Snackbar", "Speed Dial", "Stack", "Stepper", "Switch",
		"Table", "Tabs", "Text Field", "Textarea Autosize", "Timeline",
		"Toggle Button", "Tooltip", "Transfer List", "Tree View", "Typography"
	];

	// Component categorization for search based on MUI's structure
	private readonly COMPONENT_MAP: Record<string, string[]> = {
		form: ["Text Field", "Select", "Checkbox", "Radio Button", "Switch", "Slider", "Autocomplete", "Toggle Button"],
		input: ["Text Field", "Autocomplete", "Select", "Textarea Autosize"],
		button: ["Button", "Floating Action Button", "Button Group", "Toggle Button"],
		navigation: ["App Bar", "Bottom Navigation", "Breadcrumbs", "Drawer", "Link", "Menu", "Stepper", "Tabs"],
		layout: ["Box", "Container", "Grid", "Stack", "Image List", "Masonry"],
		data: ["Table", "List", "Transfer List", "Tree View", "Pagination"],
		feedback: ["Alert", "Backdrop", "Dialog", "Progress", "Circular Progress", "Linear Progress", "Skeleton", "Snackbar"],
		overlay: ["Modal", "Popover", "Popper", "Tooltip", "Menu", "Drawer", "Dialog"],
		surface: ["Card", "Paper", "Accordion"],
		display: ["Avatar", "Badge", "Chip", "Divider", "Typography", "Timeline"],
		selection: ["Checkbox", "Radio Button", "Select", "Switch", "Autocomplete"],
		notification: ["Alert", "Snackbar"],
		loading: ["Circular Progress", "Linear Progress", "Skeleton", "Backdrop"],
		utility: ["Click Away Listener", "CSS Baseline", "Portal", "No SSR"],
	};

	// Helper method to convert component name to kebab-case
	private toKebabCase(name: string): string {
		return name
			.toLowerCase()
			.replace(/\s+/g, "-");
	}

	// Helper method to get the documentation URL for a component
	private getComponentUrl(component: string): string {
		const kebabName = this.toKebabCase(component);
		return `https://mui.com/material-ui/react-${kebabName}/`;
	}

	// Helper methods for extracting data from HTML
	private extractDescription(html: string): string {
		// Look for meta description
		const metaMatch = html.match(
			/<meta\s+name="description"\s+content="([^"]+)"/i,
		);
		if (metaMatch) return metaMatch[1];

		const pMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
		return pMatch ? pMatch[1] : "Component description not available";
	}

	private extractImport(html: string, componentName: string): string {
		// Look for import statements in code blocks
		const importMatch = html.match(
			new RegExp(`import\\s*{[^}]*${componentName.replace(/\s+/g, "")}[^}]*}\\s*from\\s*["']@mui/material["']`, "i"),
		);
		if (importMatch) return importMatch[0];

		// Default import based on component name
		const pascalName = componentName.replace(/\s+/g, "");
		return `import { ${pascalName} } from '@mui/material';`;
	}

	private extractUsage(html: string): string {
		// Extract first code example
		const codeMatch = html.match(/<code[^>]*>([^<]+)<\/code>/i);
		return codeMatch
			? `\`\`\`tsx\n${codeMatch[1]}\n\`\`\``
			: "See documentation for usage examples.";
	}

	async init() {
		// List all available Material UI components
		this.server.tool("list_components", {}, async () => {
			const componentList = this.COMPONENTS
				.map((name) => {
					const kebabCase = this.toKebabCase(name);
					return `- ${name} (${kebabCase})`;
				})
				.join("\n");

			return {
				content: [
					{
						type: "text",
						text: `# Material UI Components (${this.COMPONENTS.length} total)\n\n${componentList}\n\nUse get_component_info with the kebab-case name to get details.\n\nFor comprehensive MUI documentation guidance, use get_mui_guide.`,
					},
				],
			};
		});

		// Get component information and usage
		this.server.tool(
			"get_component_info",
			{
				component: z
					.string()
					.describe("Component name in kebab-case (e.g., 'button', 'text-field', 'app-bar')"),
			},
			async ({ component }) => {
				const url = `https://mui.com/material-ui/react-${component}/`;

				try {
					const response = await fetch(url);
					if (!response.ok) {
						return {
							content: [
								{
									type: "text",
									text: `Error: Component '${component}' not found. Use list_components to see available components.`,
								},
							],
						};
					}

					const html = await response.text();

					// Extract key information from HTML
					const description = this.extractDescription(html);
					const componentTitle = component.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
					const importStatement = this.extractImport(html, componentTitle);

					return {
						content: [
							{
								type: "text",
								text: `# ${componentTitle} Component\n\n${description}\n\n## Import\n\`\`\`tsx\n${importStatement}\n\`\`\`\n\n## Documentation\nFull documentation: ${url}\n\nFor API reference and props, visit the API tab on the documentation page.\n\n## Related Resources\n- Check the documentation page for live demos and examples\n- Use get_customization_guide for theming and styling options\n- Use search_components to find related components`,
							},
						],
					};
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `Error fetching component info: ${error instanceof Error ? error.message : String(error)}`,
							},
						],
					};
				}
			},
		);

		// Get MUI customization and theming guide
		this.server.tool("get_customization_guide", {}, async () => {
			return {
				content: [
					{
						type: "text",
						text: `# Material UI Customization Guide

Material UI provides multiple ways to customize components:

## 1. Theme Customization

Create a custom theme using \`createTheme\`:

\`\`\`tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app */}
    </ThemeProvider>
  );
}
\`\`\`

## 2. Component-Level Customization

### Using sx prop (recommended for one-off styles):
\`\`\`tsx
<Button sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}>
  Custom Button
</Button>
\`\`\`

### Using styled() API:
\`\`\`tsx
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
\`\`\`

## 3. Theme Component Overrides

Override default props or styles for all instances:

\`\`\`tsx
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
      defaultProps: {
        variant: 'contained',
      },
    },
  },
});
\`\`\`

## 4. Color Modes (Dark Mode)

\`\`\`tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'dark', // or 'light'
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app */}
    </ThemeProvider>
  );
}
\`\`\`

## Key Resources
- Full customization guide: https://mui.com/material-ui/customization/how-to-customize/
- Theming: https://mui.com/material-ui/customization/theming/
- Default theme structure: https://mui.com/material-ui/customization/default-theme/
- CSS Baseline for consistent styles: https://mui.com/material-ui/react-css-baseline/`,
					},
				],
			};
		});

		// Search components by use case or keywords
		this.server.tool(
			"search_components",
			{
				query: z
					.string()
					.describe(
						"Search query or use case (e.g., 'form input', 'navigation', 'table data')",
					),
			},
			async ({ query }) => {
				const lowerQuery = query.toLowerCase();
				const matches = new Set<string>();

				// Search in categories
				for (const [category, components] of Object.entries(this.COMPONENT_MAP)) {
					if (lowerQuery.includes(category)) {
						for (const c of components) {
							matches.add(c);
						}
					}
				}

				// Search in component names
				this.COMPONENTS.forEach((component) => {
					if (component.toLowerCase().includes(lowerQuery)) {
						matches.add(component);
					}
				});

				if (matches.size === 0) {
					return {
						content: [
							{
								type: "text",
								text: `No components found matching '${query}'.\n\nTry broader terms like: form, navigation, overlay, feedback, data, layout, input, button`,
							},
						],
					};
				}

				const resultList = Array.from(matches)
					.map((name) => {
						const kebab = this.toKebabCase(name);
						const url = this.getComponentUrl(name);
						return `- ${name} (${kebab})\n  ${url}`;
					})
					.join("\n");

				return {
					content: [
						{
							type: "text",
							text: `# Components matching "${query}" (${matches.size} found)\n\n${resultList}\n\nUse get_component_info with the kebab-case name for details.`,
						},
					],
				};
			},
		);

		// Get MUI installation and setup guide
		this.server.tool("get_setup_guide", {}, async () => {
			return {
				content: [
					{
						type: "text",
						text: `# Material UI Setup Guide

## Installation

### npm
\`\`\`bash
npm install @mui/material @emotion/react @emotion/styled
\`\`\`

### yarn
\`\`\`bash
yarn add @mui/material @emotion/react @emotion/styled
\`\`\`

### pnpm
\`\`\`bash
pnpm add @mui/material @emotion/react @emotion/styled
\`\`\`

## Roboto Font (Optional but Recommended)

Material UI uses the Roboto font by default. Add to your HTML:

\`\`\`html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
/>
\`\`\`

Or install via npm:
\`\`\`bash
npm install @fontsource/roboto
\`\`\`

Then import in your app:
\`\`\`tsx
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
\`\`\`

## Icons (Optional)

For Material Icons:

\`\`\`bash
npm install @mui/icons-material
\`\`\`

Usage:
\`\`\`tsx
import DeleteIcon from '@mui/icons-material/Delete';

<Button startIcon={<DeleteIcon />}>Delete</Button>
\`\`\`

## Basic Usage

\`\`\`tsx
import Button from '@mui/material/Button';

function App() {
  return <Button variant="contained">Hello World</Button>;
}

export default App;
\`\`\`

## With Theme Provider

\`\`\`tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app content */}
    </ThemeProvider>
  );
}
\`\`\`

## Resources
- Installation docs: https://mui.com/material-ui/getting-started/installation/
- Usage guide: https://mui.com/material-ui/getting-started/usage/
- Example projects: https://mui.com/material-ui/getting-started/example-projects/`,
					},
				],
			};
		});

		// Get comprehensive MUI documentation guide
		this.server.tool("get_mui_guide", {}, async () => {
			return {
				content: [
					{
						type: "text",
						text: `# Material UI Documentation Guide

## About Material UI

Material UI is the world's most popular React UI framework, implementing Google's Material Design specification. It provides a comprehensive suite of 50+ production-ready components.

## Key Features

- **Production-ready components**: Battle-tested components used by thousands of companies
- **Customization**: Extensive theming and styling options
- **Accessibility**: WCAG 2.0 compliant components
- **TypeScript**: Full TypeScript support with rich type definitions
- **Design Resources**: Figma kits and design tools available

## Component Categories

1. **Inputs**: Text Field, Select, Checkbox, Radio, Switch, Slider, Autocomplete
2. **Data Display**: Table, List, Typography, Avatar, Badge, Chip, Tooltip
3. **Feedback**: Alert, Dialog, Progress, Snackbar, Skeleton
4. **Surfaces**: Card, Paper, Accordion
5. **Navigation**: App Bar, Drawer, Tabs, Breadcrumbs, Menu, Stepper
6. **Layout**: Box, Container, Grid, Stack
7. **Utils**: Click Away Listener, CSS Baseline, Portal

## Getting Started Workflow

1. **Install**: Use get_setup_guide tool
2. **Browse Components**: Use list_components to see all available components
3. **Find Components**: Use search_components to find components by use case
4. **Learn Component**: Use get_component_info for specific component details
5. **Customize**: Use get_customization_guide for theming and styling

## Best Practices

### Import Individual Components
\`\`\`tsx
// Good - tree-shakeable
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Avoid - imports entire library
import { Button, TextField } from '@mui/material';
\`\`\`

### Use Theme Provider
Always wrap your app in ThemeProvider for consistent styling:
\`\`\`tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  // your customization
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app */}
    </ThemeProvider>
  );
}
\`\`\`

### Use sx Prop for Styling
The sx prop is the recommended way for one-off styles:
\`\`\`tsx
<Box sx={{ p: 2, bgcolor: 'primary.main', borderRadius: 1 }}>
  Content
</Box>
\`\`\`

## Important Documentation Links

- **Main docs**: https://mui.com/material-ui/
- **All components**: https://mui.com/material-ui/all-components/
- **Customization**: https://mui.com/material-ui/customization/how-to-customize/
- **Theming**: https://mui.com/material-ui/customization/theming/
- **Icons**: https://mui.com/material-ui/icons/
- **Templates**: https://mui.com/material-ui/getting-started/templates/

## MCP Tools Available

- **list_components**: See all available components
- **get_component_info**: Get detailed component information
- **search_components**: Find components by use case
- **get_customization_guide**: Learn theming and styling
- **get_setup_guide**: Installation and setup instructions
- **get_mui_guide**: This comprehensive guide

## Support

- GitHub Issues: https://github.com/mui/material-ui/issues
- Stack Overflow: Tag questions with [material-ui]
- Discord: https://mui.com/material-ui/getting-started/support/`,
					},
				],
			};
		});
	}
}

// Define empty Env interface for Cloudflare Workers
interface Env {}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
