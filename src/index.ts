#!/usr/bin/env node

/**
 * Timing MCP Server
 * Provides Model Context Protocol access to Timing API for time tracking,
 * project management, and productivity insights
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import all MCP tools
import {
  listProjectsTool,
  getProjectTool,
  createProjectTool,
  updateProjectTool,
  deleteProjectTool,
  listProjectsHierarchyTool
} from './tools/projectsTools.js';
import {
  listTimeEntriesTool,
  getTimeEntryTool,
  createTimeEntryTool,
  updateTimeEntryTool,
  deleteTimeEntryTool,
  startTimeEntryTool,
  stopTimeEntryTool,
  batchUpdateTimeEntriesTool
} from './tools/timeEntriesTools.js';
import {
  listTeamsTool,
  getTeamTool
} from './tools/teamsTools.js';
import {
  generateReportTool
} from './tools/reportsTools.js';
import {
  getGranularActivityTool
} from './tools/localDbTools.js';

// Import MCP prompts
import { TIMING_PROMPTS, getTimingPromptByName } from './prompts/timingPrompts.js';

/**
 * Available MCP tools for Timing API access
 */
const AVAILABLE_TOOLS = [
  // Local Database
  getGranularActivityTool,
  // Projects
  listProjectsTool,
  listProjectsHierarchyTool,
  getProjectTool,
  createProjectTool,
  updateProjectTool,
  deleteProjectTool,
  // Time Entries
  listTimeEntriesTool,
  getTimeEntryTool,
  createTimeEntryTool,
  updateTimeEntryTool,
  deleteTimeEntryTool,
  startTimeEntryTool,
  stopTimeEntryTool,
  batchUpdateTimeEntriesTool,
  // Teams
  listTeamsTool,
  getTeamTool,
  // Reports
  generateReportTool
];

const server = new Server(
  {
    name: "timing-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

/**
 * Handle resource listing - currently no resources provided
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [],
  };
});

/**
 * Handle resource reading - currently no resources provided
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  throw new Error(`Resource not found: ${request.params.uri}`);
});

/**
 * Handle prompt listing - return all available Timing prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: TIMING_PROMPTS.map(prompt => ({
      name: prompt.name,
      description: prompt.description,
      arguments: prompt.arguments
    }))
  };
});

/**
 * Handle prompt retrieval - return specific prompt template
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const prompt = getTimingPromptByName(name);
  if (!prompt) {
    throw new Error(`Prompt not found: ${name}`);
  }

  // Generate prompt template based on the specific prompt type
  let template = '';
  
  switch (name) {
    case 'weekly_time_report':
      template = generateWeeklyTimeReportPrompt(args);
      break;
    case 'project_time_analysis':
      template = generateProjectTimeAnalysisPrompt(args);
      break;
    case 'productivity_insights':
      template = generateProductivityInsightsPrompt(args);
      break;
    case 'billing_summary':
      template = generateBillingSummaryPrompt(args);
      break;
    case 'time_entry_audit':
      template = generateTimeEntryAuditPrompt(args);
      break;
    case 'project_hierarchy_overview':
      template = generateProjectHierarchyOverviewPrompt(args);
      break;
    case 'monthly_time_summary':
      template = generateMonthlyTimeSummaryPrompt(args);
      break;
    default:
      throw new Error(`Prompt template not implemented: ${name}`);
  }

  return {
    description: prompt.description,
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: template
        }
      }
    ]
  };
});

/**
 * Handle tool listing - return all available Timing tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: AVAILABLE_TOOLS.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  };
});

/**
 * Handle tool execution - dispatch to appropriate tool handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // Find the requested tool
  const tool = AVAILABLE_TOOLS.find(t => t.name === name);
  
  if (!tool) {
    throw new Error(`Tool not found: ${name}`);
  }

  try {
    // Execute the tool with provided arguments
    const result = await tool.handler(args as any || {});
    
    return {
      content: [
        {
          type: "text",
          text: result
        }
      ]
    };
  } catch (error) {
    // Return error as text response rather than throwing
    return {
      content: [
        {
          type: "text", 
          text: `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ]
    };
  }
});

// Prompt template generation functions
function generateWeeklyTimeReportPrompt(args: any): string {
  const weekStart = args?.week_start || 'current Monday';
  const includeProjectBreakdown = args?.include_project_breakdown !== false;
  
  return `Please generate a comprehensive weekly time tracking report for the week starting ${weekStart}.

Use the following Timing tools to gather the necessary data:
1. timing_list_time_entries - to retrieve all time entries for the specified week
2. timing_list_projects - to get project details and names
3. generate_timing_report - for comprehensive report data

The report should include:
- Total hours worked during the week
${includeProjectBreakdown ? '- Detailed breakdown by project with project names and time distribution' : ''}
- Daily time distribution
- Productivity insights and recommendations
- Any running timers or incomplete entries

Format the output as a well-structured report with clear sections and actionable insights.`;
}

function generateProjectTimeAnalysisPrompt(args: any): string {
  const projectIds = args?.project_ids || '';
  const timePeriod = args?.time_period || 'last_month';
  const projectFilter = projectIds ? `projects with IDs: ${projectIds}` : 'all projects';
  
  return `Please conduct a detailed time analysis for ${projectFilter} over the ${timePeriod} period.

Use these Timing tools for comprehensive project analysis:
1. timing_list_time_entries - to get detailed time entries for project analysis
2. timing_list_projects - to understand project context and hierarchy
3. generate_timing_report - for aggregated project data

Provide detailed analysis including:
- Total time invested per project with breakdown
- Project efficiency metrics and time utilization rates
- Time distribution patterns across projects
- Identification of time-consuming activities
- Project hierarchy and time allocation
- Recommendations for improved project time management

Include visual summaries and actionable insights for optimizing project delivery.`;
}

function generateProductivityInsightsPrompt(args: any): string {
  const period = args?.analysis_period || 'last_month';
  const focusArea = args?.focus_area || 'general_productivity';
  
  return `Please analyze my productivity patterns for the period: ${period}, with focus on: ${focusArea}.

Use these Timing tools for comprehensive analysis:
1. timing_list_time_entries - to analyze time tracking patterns and project distribution
2. timing_list_projects - to get context about project types and productivity scores
3. generate_timing_report - for app usage and productivity data

Provide insights on:
- Time allocation efficiency across different projects
- Work pattern consistency and optimal productive hours
- Project switching frequency and impact on productivity
- Productivity score trends across projects
- Identification of productivity bottlenecks or inefficiencies
- Personalized recommendations for productivity improvement
- Suggested workflow optimizations based on observed patterns

Include specific metrics and actionable recommendations tailored to my work style.`;
}

function generateBillingSummaryPrompt(args: any): string {
  const startDate = args?.start_date || 'start of current month';
  const endDate = args?.end_date || 'end of current month';
  const includeStatusBreakdown = args?.include_status_breakdown !== false;
  
  return `Please generate a comprehensive billing summary for the period from ${startDate} to ${endDate}.

Use these Timing tools for billing analysis:
1. timing_list_time_entries - to retrieve time entries with billing status
2. generate_timing_report - for aggregated billing data

The summary should include:
- Total billable hours vs non-billable hours
${includeStatusBreakdown ? '- Breakdown by billing status (billable, not_billable, billed, paid)' : ''}
- Revenue insights based on billable time
- Project-wise billing breakdown
- Billing status trends and patterns
- Recommendations for improving billing efficiency

Format the output as a clear billing summary suitable for client invoicing and business analysis.`;
}

function generateTimeEntryAuditPrompt(args: any): string {
  const startDate = args?.start_date || 'start of current month';
  const endDate = args?.end_date || 'end of current month';
  const checkRunning = args?.check_running_entries !== false;
  
  return `Please conduct a time entry audit for the period from ${startDate} to ${endDate}.

Use these Timing tools for auditing:
1. timing_list_time_entries - to retrieve all time entries for the period
2. timing_list_projects - to verify project references
${checkRunning ? '3. Check for entries with isRunning=true to identify incomplete entries' : ''}

The audit should identify:
- Missing or incomplete time entries
${checkRunning ? '- Entries that are still running (may need to be stopped)' : ''}
- Time entries without project assignments
- Entries with missing or unclear titles
- Duplicate or overlapping time entries
- Entries with inconsistent billing status
- Recommendations for improving time entry completeness

Provide a clear audit report with specific issues identified and corrective actions recommended.`;
}

function generateProjectHierarchyOverviewPrompt(args: any): string {
  const teamId = args?.team_id || '';
  const includeArchived = args?.include_archived === true;
  
  return `Please provide a comprehensive overview of the project hierarchy${teamId ? ` for team ${teamId}` : ''}.

Use these Timing tools for hierarchy analysis:
1. timing_list_projects_hierarchy - to get the complete project structure
2. timing_list_time_entries - to analyze time distribution across projects
3. generate_timing_report - for project-level time aggregation

The overview should include:
- Complete project hierarchy visualization
- Time distribution across parent and child projects
- Project productivity scores and their impact
- Archived vs active project breakdown${includeArchived ? ' (including archived projects)' : ''}
- Recommendations for project organization
- Identification of underutilized or overutilized projects

Present findings in a format that clearly shows the project structure and time allocation.`;
}

function generateMonthlyTimeSummaryPrompt(args: any): string {
  const month = args?.month || new Date().getMonth() + 1;
  const year = args?.year || new Date().getFullYear();
  const includeComparisons = args?.include_comparisons !== false;
  
  return `Please create a comprehensive monthly time summary for ${month}/${year}.

Use these Timing tools to gather data:
1. timing_list_time_entries - for detailed time tracking analysis
2. timing_list_projects - to understand project portfolio
3. generate_timing_report - for aggregated monthly data
${includeComparisons ? '4. Compare with previous month data' : ''}

The summary should cover:
- Overall time utilization and total hours
- Project-wise time distribution and trends
- Daily and weekly patterns
- Productivity insights
${includeComparisons ? '- Month-over-month comparisons and trends' : ''}
- Key highlights and achievements
- Recommendations for the upcoming month

Present findings in an executive summary format suitable for review and planning.`;
}

/**
 * Main server initialization and startup
 */
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Timing MCP Server running on stdio");
    console.error(`Available tools: ${AVAILABLE_TOOLS.map(t => t.name).join(', ')}`);
    console.error(`Available prompts: ${TIMING_PROMPTS.map(p => p.name).join(', ')}`);
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
