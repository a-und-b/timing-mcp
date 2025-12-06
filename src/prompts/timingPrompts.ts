import { Prompt } from '@modelcontextprotocol/sdk/types.js';

export interface TimingPrompt extends Prompt {
  name: string;
  description: string;
  arguments?: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
}

export const TIMING_PROMPTS: TimingPrompt[] = [
  {
    name: 'weekly_time_report',
    description: 'Generates a detailed weekly time tracking report with project breakdown and time distribution analysis',
    arguments: [
      {
        name: 'week_start',
        description: 'Start date of the week (YYYY-MM-DD format). Default: current Monday',
        required: false
      },
      {
        name: 'include_project_breakdown',
        description: 'Whether to include detailed project-by-project breakdown',
        required: false
      }
    ]
  },
  {
    name: 'project_time_analysis',
    description: 'Analyzes time spent across projects with insights on productivity, distribution, and trends',
    arguments: [
      {
        name: 'project_ids',
        description: 'Specific project IDs to analyze (comma-separated). Empty = all projects',
        required: false
      },
      {
        name: 'time_period',
        description: 'Time period for analysis (last_week, last_month, last_quarter, current_year)',
        required: false
      }
    ]
  },
  {
    name: 'productivity_insights',
    description: 'Analyzes productivity patterns, work habits, and provides personalized recommendations',
    arguments: [
      {
        name: 'analysis_period',
        description: 'Time period for analysis (last_week, last_month, last_quarter, current_year)',
        required: false
      },
      {
        name: 'focus_area',
        description: 'Focus area for analysis (time_distribution, project_efficiency, work_patterns, app_usage)',
        required: false
      }
    ]
  },
  {
    name: 'billing_summary',
    description: 'Generates billing status summary with revenue insights and billable vs non-billable time analysis',
    arguments: [
      {
        name: 'start_date',
        description: 'Start date for billing summary (YYYY-MM-DD format)',
        required: false
      },
      {
        name: 'end_date',
        description: 'End date for billing summary (YYYY-MM-DD format)',
        required: false
      },
      {
        name: 'include_status_breakdown',
        description: 'Whether to include breakdown by billing status (billable, billed, paid)',
        required: false
      }
    ]
  },
  {
    name: 'time_entry_audit',
    description: 'Audits time entries for completeness, accuracy, and identifies gaps or inconsistencies',
    arguments: [
      {
        name: 'start_date',
        description: 'Start date for audit (YYYY-MM-DD format)',
        required: false
      },
      {
        name: 'end_date',
        description: 'End date for audit (YYYY-MM-DD format)',
        required: false
      },
      {
        name: 'check_running_entries',
        description: 'Whether to check for entries that are still running',
        required: false
      }
    ]
  },
  {
    name: 'project_hierarchy_overview',
    description: 'Visualizes project structure and time distribution across the project hierarchy',
    arguments: [
      {
        name: 'team_id',
        description: 'Filter by team ID (optional)',
        required: false
      },
      {
        name: 'include_archived',
        description: 'Whether to include archived projects',
        required: false
      }
    ]
  },
  {
    name: 'monthly_time_summary',
    description: 'Creates comprehensive monthly time summary with trends, project distribution, and insights',
    arguments: [
      {
        name: 'month',
        description: 'Month for the report (1-12, default: current month)',
        required: false
      },
      {
        name: 'year',
        description: 'Year for the report (default: current year)',
        required: false
      },
      {
        name: 'include_comparisons',
        description: 'Whether to include comparisons with previous month',
        required: false
      }
    ]
  }
];

export function getTimingPromptByName(name: string): TimingPrompt | undefined {
  return TIMING_PROMPTS.find(prompt => prompt.name === name);
}

export function getTimingPromptNames(): string[] {
  return TIMING_PROMPTS.map(prompt => prompt.name);
}
