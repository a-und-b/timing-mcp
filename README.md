# ⏱️ Timing MCP Server

A Model Context Protocol (MCP) server that provides comprehensive access to the Timing API for time tracking, project management, and productivity insights.

> [!warning]
> This repository is not affiliated with Timing. It is an independent project created to enhance the functionality of the Timing application.

> [!note]
> This is a fork of [tomoyanakano/timing-mcp-server](https://github.com/tomoyanakano/timing-mcp-server), extended with additional capabilities, prompts support, and production-ready structure.

## ⚡ Quick Start

```bash
npx -y @a-und-b/timing-mcp
```

That's it! The server will start and be ready to connect to your MCP client.

## 🚀 Installation

### Prerequisites

- Node.js ≥ 18.0.0
- Timing account with API access
- Timing API key ([Get your API key here](https://web.timingapp.com/integrations/tokens))

### MCP Client Integration

<details>
<summary><strong>Claude Desktop</strong></summary>

Add to your Claude Desktop claude_desktop_config.json file:

**MacOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "timing": {
      "command": "npx",
      "args": ["-y", "@a-und-b/timing-mcp"],
      "env": {
        "TIMING_API_KEY": "your-timing-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Add to your Cursor settings:

**MacOS:** `~/Library/Application Support/Cursor/User/settings.json`  
**Windows:** `%APPDATA%\Cursor\User\settings.json`  
**Linux:** `~/.config/Cursor/User/settings.json`

```json
{
  "mcpServers": {
    "timing": {
      "command": "npx",
      "args": ["-y", "@a-und-b/timing-mcp"],
      "env": {
        "TIMING_API_KEY": "your-timing-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Windsurf</strong></summary>

Add to your Windsurf MCP configuration:

```json
{
   "mcpServers": {
      "timing": {
         "command": "npx",
         "args": ["-y", "@a-und-b/timing-mcp"],
         "env": {
            "TIMING_API_KEY": "your-timing-api-key"
         }
      }
   }
}
```

</details>

<details>
<summary><strong>Claude Code (CLI)</strong></summary>

Add the MCP server to Claude Code:

```bash
claude mcp add -e TIMING_API_KEY="your-timing-api-key" timing -- npx -y @a-und-b/timing-mcp
```

</details>

<details>
<summary><strong>Gemini CLI</strong></summary>

Configure Gemini CLI with MCP support:

```json
{
   "mcpServers": {
      "timing": {
         "command": "npx",
         "args": ["-y", "@a-und-b/timing-mcp"],
         "env": {
            "TIMING_API_KEY": "your-timing-api-key"
         }
      }
   }
}
```

</details>

<details>
<summary><strong>Kiro</strong></summary>

1. Go to `Kiro` > `MCP Servers`
2. Add new MCP server by clicking `+ Add`
3. Paste the configuration below:

```json
{
  "mcpServers": {
    "timing": {
    "command": "npx",
    "args": [
      "-y",
      "@a-und-b/timing-mcp"
    ],
    "env": {
       "TIMING_API_KEY": "your-timing-api-key"
    },
    "disabled": false,
    "autoApprove": []
    }
  }
}
```

4. Click `Save` to apply changes
</details>

<details>
<summary><strong>LM Studio</strong></summary>

1. Go to `Program` (right side) > `Install` > `Edit mcp.json`
2. Paste the configuration below:
```json
{
  "mcpServers": {
    "timing": {
      "command": "npx",
      "args": ["-y", "@a-und-b/timing-mcp"],
       "env": {
          "TIMING_API_KEY": "your-timing-api-key"
       }
    }
  }
}
```
3. Click `Save` to apply changes
4. Toggle MCP server on/off from the right hand side (under `Program`) or by clicking the plug icon at the bottom of the chat box

</details>

## 🔑 Timing API Setup

### Getting Your API Key

1. **Log into your Timing account**
2. **Navigate to API settings:**
   - Go to **Integrations** → **API Keys**
   - Or visit: [https://web.timingapp.com/integrations/tokens](https://web.timingapp.com/integrations/tokens)
3. **Generate a new API key** (if you don't have one)
4. **Copy the API key** and add it to your MCP client configuration

### Environment Variables

You can set environment variables in several ways:

**Option 1: System Environment Variables**
```bash
export TIMING_API_KEY="your-timing-api-key"
```

**Option 2: .env File (for local development)**
```env
TIMING_API_KEY=your-timing-api-key
```

**Option 3: MCP Client Configuration (recommended)**
Use the `env` section in your MCP client configuration as shown above.

## 🛠️ Available Tools

### Projects

| Tool | Description | Parameters |
|------|-------------|------------|
| `timing_list_projects` | List all projects with optional filtering | `title`, `hideArchived`, `teamId` (all optional) |
| `timing_list_projects_hierarchy` | Get hierarchical project structure | `teamId` (optional) |
| `timing_project` | Get project details | `id` |
| `timing_create_project` | Create a new project | `title`, `parent`, `color`, `notes`, `productivityScore`, etc. |
| `timing_update_project` | Update an existing project | `projectId`, various optional fields |
| `timing_delete_project` | Delete a project | `projectId` |

### Time Entries

| Tool | Description | Parameters |
|------|-------------|------------|
| `timing_list_time_entries` | List time entries with filtering | `startDateMin`, `endDateMax`, `projects`, `searchQuery`, etc. |
| `timing_time_entry` | Get time entry details | `id` |
| `timing_create_time_entry` | Create a new time entry | `project`, `title`, `startDate`, `endDate`, `notes`, `billingStatus` |
| `timing_update_time_entry` | Update an existing time entry | `timeEntryId`, various optional fields |
| `timing_delete_time_entry` | Delete a time entry | `timeEntryId` |
| `timing_start_time_entry` | Start a new timer | `project`, `title`, `startDate`, `notes` |
| `timing_stop_time_entry` | Stop the current timer | (no parameters) |
| `timing_batch_update_time_entries` | Batch update multiple time entries | `timeEntryIds`, `billingStatus`, `customFields` |

### Teams

| Tool | Description | Parameters |
|------|-------------|------------|
| `timing_list_teams` | List all teams | (no parameters) |
| `timing_team` | Get team details | `id` |

### Reports

| Tool | Description | Parameters |
|------|-------------|------------|
| `generate_timing_report` | Generate comprehensive report | `startDateMin`, `startDateMax`, `projects`, `columns`, etc. |

## 🎯 Available Prompts

The Timing MCP server provides 7 intelligent prompts that orchestrate multiple tools to deliver comprehensive insights:

| Prompt | Description | Key Parameters |
|--------|-------------|----------------|
| `weekly_time_report` | Generates detailed weekly time tracking report with project breakdown | `week_start`, `include_project_breakdown` |
| `project_time_analysis` | Analyzes time spent across projects with insights | `project_ids`, `time_period` |
| `productivity_insights` | Analyzes productivity patterns and provides recommendations | `analysis_period`, `focus_area` |
| `billing_summary` | Generates billing status summary with revenue insights | `start_date`, `end_date`, `include_status_breakdown` |
| `time_entry_audit` | Audits time entries for completeness and accuracy | `start_date`, `end_date`, `check_running_entries` |
| `project_hierarchy_overview` | Visualizes project structure and time distribution | `team_id`, `include_archived` |
| `monthly_time_summary` | Creates comprehensive monthly time summary with trends | `month`, `year`, `include_comparisons` |

### Prompt Examples

**Weekly Time Report:**
```json
{
  "name": "weekly_time_report",
  "arguments": {
    "week_start": "2024-01-15",
    "include_project_breakdown": true
  }
}
```

**Project Time Analysis:**
```json
{
  "name": "project_time_analysis",
  "arguments": {
    "project_ids": "1,2,3",
    "time_period": "last_month"
  }
}
```

**Billing Summary:**
```json
{
  "name": "billing_summary",
  "arguments": {
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "include_status_breakdown": true
  }
}
```

## 📝 Tool Examples

### List Projects

```json
{
  "name": "timing_list_projects",
  "arguments": {
    "hideArchived": true
  }
}
```

### Create Project

```json
{
  "name": "timing_create_project",
  "arguments": {
    "title": "Website Redesign",
    "color": "#FF0000",
    "productivityScore": 1,
    "notes": "Main client project"
  }
}
```

### List Time Entries

```json
{
  "name": "timing_list_time_entries",
  "arguments": {
    "startDateMin": "2024-01-01T00:00:00+00:00",
    "endDateMax": "2024-01-31T23:59:59+00:00",
    "includeProjectData": true
  }
}
```

### Create Time Entry

```json
{
  "name": "timing_create_time_entry",
  "arguments": {
    "project": "/projects/1",
    "title": "Frontend Development",
    "startDate": "2024-01-15T09:00:00+00:00",
    "endDate": "2024-01-15T17:00:00+00:00",
    "notes": "Implemented new features",
    "billingStatus": "billable"
  }
}
```

### Start Timer

```json
{
  "name": "timing_start_time_entry",
  "arguments": {
    "project": "/projects/1",
    "title": "Working on feature",
    "notes": "Starting development"
  }
}
```

### Generate Report

```json
{
  "name": "generate_timing_report",
  "arguments": {
    "startDateMin": "2024-01-01",
    "startDateMax": "2024-01-31",
    "columns": ["title", "project", "duration"],
    "timespanGroupingMode": "day"
  }
}
```

## 🔧 Advanced Configuration

<details>
<summary><strong>Local Development</strong></summary>

If you want to run from source:

```bash
git clone https://github.com/a-und-b/timing-mcp.git
cd timing-mcp
npm install
npm run build
npm start
```

Then configure your MCP client to use the local path:

```json
{
  "mcpServers": {
    "timing": {
      "command": "node",
      "args": ["/path/to/timing-mcp/dist/index.js"],
      "env": {
        "TIMING_API_KEY": "your-timing-api-key"
      }
    }
  }
}
```

</details>

<details>
<summary><strong>Docker Support</strong></summary>

```dockerfile
FROM node:18-alpine
WORKDIR /app
RUN npm install -g @a-und-b/timing-mcp
ENV TIMING_API_KEY=""
CMD ["timing-mcp"]
```

</details>

## 🔍 Troubleshooting

### Common Issues

**❌ Authentication Error:**
```
TIMING_API_KEY environment variable is not set
```
- Verify your API key is correct
- Check if the API key is properly set in environment variables
- Ensure the key hasn't expired

**❌ Node.js Version Error:**
```
This package requires Node.js >= 18.0.0
```
- Update Node.js to version 18 or higher
- Check your version: `node --version`

**❌ npx Connection Issues:**
```
Error: Cannot find module '@a-und-b/timing-mcp'
```
- Ensure you have internet connection
- Try: `npx --yes @a-und-b/timing-mcp`
- Clear npx cache: `npx clear-npx-cache`

**❌ MCP Client Not Finding Tools:**
- Restart your MCP client after configuration changes
- Check that environment variables are properly set
- Verify JSON configuration syntax is correct

### Debug Mode

For debugging, you can run the server with additional logging:

```bash
NODE_ENV=development npx -y @a-und-b/timing-mcp
```

### Testing Connection

You can test the server manually:

```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | npx -y @a-und-b/timing-mcp
```

## 🌟 Features

- **✅ Full CRUD Support:** Create, read, update, and delete across projects and time entries
- **🔄 Automatic Validation:** Input validation using Zod schemas
- **📊 Comprehensive Reports:** Generate detailed reports with flexible filtering
- **⏱️ Timer Control:** Start and stop timers for time tracking
- **💰 Billing Status:** Track billing status (billable, not_billable, billed, paid)
- **🏗️ Project Hierarchy:** Access hierarchical project structures
- **🧩 Comprehensive Tools:** 18 specialized tools for different use cases
- **🎯 Intelligent Prompts:** 7 AI-powered prompts for complex analysis and insights
- **🌐 Multi-Client Support:** Works with all major MCP clients
- **📝 Custom Fields:** Support for custom fields on projects and time entries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is a fork of [tomoyanakano/timing-mcp-server](https://github.com/tomoyanakano/timing-mcp-server), extended with comprehensive capabilities, prompts support, and production-ready structure.

## 🆘 Support

- **Timing API Issues:** [Timing API Documentation](https://web.timingapp.com/llms.txt)
- **MCP Protocol:** [MCP Documentation](https://modelcontextprotocol.io/)
- **This Package:** [GitHub Issues](https://github.com/a-und-b/timing-mcp/issues)
