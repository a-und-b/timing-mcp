/**
 * MCP tools for Reports generation
 * Provides access to Timing report generation
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TimingApiService } from '../services/timingApi.js';
import { formatTimingError } from '../utils/errorHandler.js';
import { validateDateRange } from '../utils/dateUtils.js';

// Schema for generate_timing_report tool
const GenerateReportSchema = z.object({
  startDateMin: z.string().optional().describe('Start date of the report (ISO 8601 format)'),
  startDateMax: z.string().optional().describe('End date of the report (ISO 8601 format)'),
  projects: z.array(z.string()).optional().describe('Filter by project references'),
  includeChildProjects: z.boolean().optional().describe('Include child projects in filter'),
  searchQuery: z.string().optional().describe('Search query for time entry title/notes'),
  columns: z.array(z.string()).optional().describe('Which columns to show in the report'),
  projectGroupingLevel: z.number().int().positive().optional().describe('Aggregate projects below this level by parent'),
  includeProjectData: z.boolean().optional().describe('Include full project data in response'),
  timespanGroupingMode: z.string().optional().describe('Timespan grouping mode (e.g., "day", "week", "month")'),
  sort: z.array(z.string()).optional().describe('Sort order for the report')
});

/**
 * Tool: generate_timing_report
 * Generate a comprehensive report
 */
export const generateReportTool = {
  name: 'generate_timing_report',
  description: 'Generate a comprehensive report with time entries and app usage data',
  inputSchema: zodToJsonSchema(GenerateReportSchema),
  handler: async (params: z.infer<typeof GenerateReportSchema>): Promise<string> => {
    try {
      // Validate date range if both dates provided
      if (params.startDateMin && params.startDateMax) {
        validateDateRange(params.startDateMin, params.startDateMax);
      }
      
      const apiService = new TimingApiService();
      const response = await apiService.generateReport({
        startDateMin: params.startDateMin,
        startDateMax: params.startDateMax,
        projects: params.projects,
        includeChildProjects: params.includeChildProjects,
        searchQuery: params.searchQuery,
        columns: params.columns,
        projectGroupingLevel: params.projectGroupingLevel,
        includeProjectData: params.includeProjectData,
        timespanGroupingMode: params.timespanGroupingMode,
        sort: params.sort
      });
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error generating report: ${formatTimingError(error)}`;
    }
  }
};
