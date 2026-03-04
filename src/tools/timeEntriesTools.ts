/**
 * MCP tools for Time Entries management
 * Provides CRUD operations for Timing time entries with billing status support
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TimingApiService } from '../services/timingApi.js';
import { formatTimingError } from '../utils/errorHandler.js';
import { validateDateRange } from '../utils/dateUtils.js';

// Billing status enum
const BillingStatusEnum = z.enum(['billable', 'not_billable', 'billed', 'paid']);

// Schema for list_time_entries tool
const ListTimeEntriesSchema = z.object({
  startDateMin: z.string().optional().describe('Minimum start date (ISO 8601 format)'),
  startDateMax: z.string().optional().describe('Maximum start date (ISO 8601 format)'),
  projects: z.array(z.string()).optional().describe('Filter by project references'),
  includeChildProjects: z.boolean().optional().describe('Include child projects in filter'),
  searchQuery: z.string().optional().describe('Search query for time entry title/notes'),
  isRunning: z.boolean().optional().describe('Filter by running status'),
  includeProjectData: z.boolean().optional().describe('Include full project data in response')
});

// Schema for get_time_entry tool
const GetTimeEntrySchema = z.object({
  id: z.string().describe('The ID of the time entry')
});

// Schema for create_time_entry tool
const CreateTimeEntrySchema = z.object({
  project: z.string().describe('Project reference (e.g., "/projects/1")'),
  title: z.string().min(1).describe('Title of the time entry'),
  startDate: z.string().describe('Start date/time (ISO 8601 format)'),
  endDate: z.string().optional().describe('End date/time (ISO 8601 format). Omit for running entry'),
  notes: z.string().optional().describe('Notes for the time entry'),
  billingStatus: BillingStatusEnum.optional().describe('Billing status for the time entry'),
  customFields: z.record(z.string(), z.string().nullable()).optional().describe('Custom fields as key-value pairs')
});

// Schema for update_time_entry tool
const UpdateTimeEntrySchema = z.object({
  timeEntryId: z.string().describe('The ID of the time entry to update'),
  title: z.string().min(1).optional().describe('New title for the time entry'),
  startDate: z.string().optional().describe('New start date/time (ISO 8601 format)'),
  endDate: z.string().nullable().optional().describe('New end date/time (ISO 8601 format, null to make running)'),
  notes: z.string().optional().describe('New notes for the time entry'),
  billingStatus: BillingStatusEnum.optional().describe('New billing status'),
  customFields: z.record(z.string(), z.string().nullable()).optional().describe('Custom fields to update (set to null to remove)')
});

// Schema for delete_time_entry tool
const DeleteTimeEntrySchema = z.object({
  timeEntryId: z.string().describe('The ID of the time entry to delete')
});

// Schema for start_time_entry tool
const StartTimeEntrySchema = z.object({
  project: z.string().describe('Project reference (e.g., "/projects/1")'),
  title: z.string().min(1).describe('Title of the time entry'),
  startDate: z.string().optional().describe('Start date/time (ISO 8601 format). Defaults to now'),
  notes: z.string().optional().describe('Notes for the time entry')
});

// Schema for stop_time_entry tool (no parameters needed)
const StopTimeEntrySchema = z.object({});

// Schema for batch_update_time_entries tool
const BatchUpdateTimeEntriesSchema = z.object({
  timeEntryIds: z.array(z.string()).min(1).describe('Array of time entry IDs to update'),
  billingStatus: BillingStatusEnum.optional().describe('Billing status to set for all entries'),
  customFields: z.record(z.string(), z.string().nullable()).optional().describe('Custom fields to update for all entries')
});

/**
 * Tool: timing_list_time_entries
 * List time entries with optional filtering
 */
export const listTimeEntriesTool = {
  name: 'timing_list_time_entries',
  description: 'List time entries with optional filtering by date range, projects, search query, or running status',
  inputSchema: zodToJsonSchema(ListTimeEntriesSchema),
  handler: async (params: z.infer<typeof ListTimeEntriesSchema>): Promise<string> => {
    try {
      // Validate date range if both dates provided
      if (params.startDateMin && params.startDateMax) {
        validateDateRange(params.startDateMin, params.startDateMax);
      }
      
      const apiService = new TimingApiService();
      const response = await apiService.listTimeEntries({
        startDateMin: params.startDateMin,
        startDateMax: params.startDateMax,
        projects: params.projects,
        includeChildProjects: params.includeChildProjects,
        searchQuery: params.searchQuery,
        isRunning: params.isRunning,
        includeProjectData: params.includeProjectData
      });
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error listing time entries: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_time_entry
 * Get details of a specific time entry
 */
export const getTimeEntryTool = {
  name: 'timing_time_entry',
  description: 'Get detailed information about a specific time entry by ID',
  inputSchema: zodToJsonSchema(GetTimeEntrySchema),
  handler: async (params: z.infer<typeof GetTimeEntrySchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const timeEntryId = params.id.replace(/^\/time-entries\//, '');
      const response = await apiService.getTimeEntry(timeEntryId);
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error getting time entry: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_create_time_entry
 * Create a new time entry
 */
export const createTimeEntryTool = {
  name: 'timing_create_time_entry',
  description: 'Create a new time entry in Timing. If endDate is omitted, the entry will be running.',
  inputSchema: zodToJsonSchema(CreateTimeEntrySchema),
  handler: async (params: z.infer<typeof CreateTimeEntrySchema>): Promise<string> => {
    try {
      // Validate date range if both dates provided
      if (params.endDate) {
        validateDateRange(params.startDate, params.endDate);
      }
      
      const apiService = new TimingApiService();
      const response = await apiService.createTimeEntry({
        project: params.project,
        title: params.title,
        startDate: params.startDate,
        endDate: params.endDate,
        notes: params.notes,
        billingStatus: params.billingStatus,
        customFields: params.customFields
      });
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error creating time entry: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_update_time_entry
 * Update an existing time entry
 */
export const updateTimeEntryTool = {
  name: 'timing_update_time_entry',
  description: 'Update an existing time entry. Set endDate to null to make it running.',
  inputSchema: zodToJsonSchema(UpdateTimeEntrySchema),
  handler: async (params: z.infer<typeof UpdateTimeEntrySchema>): Promise<string> => {
    try {
      // Validate date range if both dates provided
      if (params.startDate && params.endDate !== undefined && params.endDate !== null) {
        validateDateRange(params.startDate, params.endDate);
      }
      
      const apiService = new TimingApiService();
      const timeEntryId = params.timeEntryId.replace(/^\/time-entries\//, '');
      const response = await apiService.updateTimeEntry(timeEntryId, {
        title: params.title,
        startDate: params.startDate,
        endDate: params.endDate === null ? null : params.endDate,
        notes: params.notes,
        billingStatus: params.billingStatus,
        customFields: params.customFields
      });
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error updating time entry: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_delete_time_entry
 * Delete a time entry
 */
export const deleteTimeEntryTool = {
  name: 'timing_delete_time_entry',
  description: 'Delete a time entry from Timing',
  inputSchema: zodToJsonSchema(DeleteTimeEntrySchema),
  handler: async (params: z.infer<typeof DeleteTimeEntrySchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const timeEntryId = params.timeEntryId.replace(/^\/time-entries\//, '');
      await apiService.deleteTimeEntry(timeEntryId);
      
      return `Time entry ${timeEntryId} deleted successfully`;
    } catch (error) {
      return `Error deleting time entry: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_start_time_entry
 * Start a new timer
 */
export const startTimeEntryTool = {
  name: 'timing_start_time_entry',
  description: 'Start a new timer for a time entry',
  inputSchema: zodToJsonSchema(StartTimeEntrySchema),
  handler: async (params: z.infer<typeof StartTimeEntrySchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const response = await apiService.startTimer({
        project: params.project,
        title: params.title,
        startDate: params.startDate,
        notes: params.notes
      });
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error starting timer: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_stop_time_entry
 * Stop the current timer
 */
export const stopTimeEntryTool = {
  name: 'timing_stop_time_entry',
  description: 'Stop the currently running timer',
  inputSchema: zodToJsonSchema(StopTimeEntrySchema),
  handler: async (): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const response = await apiService.stopTimer();
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error stopping timer: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_batch_update_time_entries
 * Batch update multiple time entries
 */
export const batchUpdateTimeEntriesTool = {
  name: 'timing_batch_update_time_entries',
  description: 'Batch update multiple time entries with billing status or custom fields',
  inputSchema: zodToJsonSchema(BatchUpdateTimeEntriesSchema),
  handler: async (params: z.infer<typeof BatchUpdateTimeEntriesSchema>): Promise<string> => {
    try {
      // Note: This may need direct API client access if timing-api-client doesn't support batch update
      // For now, we'll update entries individually
      const apiService = new TimingApiService();
      const results: Array<{ id: string; success: boolean; error?: string }> = [];
      
      for (const timeEntryId of params.timeEntryIds) {
        try {
          const cleanId = timeEntryId.replace(/^\/time-entries\//, '');
          await apiService.updateTimeEntry(cleanId, {
            billingStatus: params.billingStatus,
            customFields: params.customFields
          });
          results.push({ id: timeEntryId, success: true });
        } catch (error) {
          results.push({
            id: timeEntryId,
            success: false,
            error: formatTimingError(error)
          });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      return JSON.stringify({
        total: params.timeEntryIds.length,
        successful: successCount,
        failed: params.timeEntryIds.length - successCount,
        results
      }, null, 2);
    } catch (error) {
      return `Error batch updating time entries: ${formatTimingError(error)}`;
    }
  }
};
