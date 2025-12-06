/**
 * Timing API service client
 * Wraps timing-api-client with error handling and consistent interface
 */

import { TimingClient } from 'timing-api-client';
import { getTimingConfig } from '../config/environment.js';
import { handleTimingApiError } from '../utils/errorHandler.js';
import type { Project, TimeEntry, Team, Report, ApiResponse } from '../types/timingTypes.js';

/**
 * Service wrapper for Timing API client
 */
export class TimingApiService {
  private readonly client: TimingClient;
  
  constructor() {
    const config = getTimingConfig();
    this.client = new TimingClient({
      apiKey: config.apiKey,
    });
  }
  
  /**
   * Get the underlying TimingClient instance
   */
  getClient(): TimingClient {
    return this.client;
  }
  
  /**
   * List projects
   */
  async listProjects(query?: {
    title?: string;
    hideArchived?: boolean;
    teamId?: string;
  }): Promise<ApiResponse<Project[]>> {
    try {
      return await this.client.projects.list(query || {});
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'list projects'));
    }
  }
  
  /**
   * Get project hierarchy
   */
  async listProjectsHierarchy(teamId?: string): Promise<ApiResponse<Project[]>> {
    try {
      // Note: timing-api-client may need to be extended for hierarchy endpoint
      // For now, we'll use the list endpoint with appropriate parameters
      return await this.client.projects.list({ teamId });
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'list project hierarchy'));
    }
  }
  
  /**
   * Get a single project
   */
  async getProject(projectId: string): Promise<ApiResponse<Project>> {
    try {
      return await this.client.projects.get(projectId);
    } catch (error) {
      throw new Error(handleTimingApiError(error, `get project ${projectId}`));
    }
  }
  
  /**
   * Create a new project
   */
  async createProject(options: {
    title: string;
    parent?: string;
    color?: string;
    notes?: string;
    productivityScore?: number;
    isArchived?: boolean;
    teamId?: string;
    defaultBillingStatus?: string;
    customFields?: Record<string, string | null>;
  }): Promise<ApiResponse<Project>> {
    try {
      return await this.client.projects.create(options);
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'create project'));
    }
  }
  
  /**
   * Update a project
   */
  async updateProject(
    projectId: string,
    options: {
      title?: string;
      color?: string;
      notes?: string;
      productivityScore?: number;
      isArchived?: boolean;
      defaultBillingStatus?: string;
      customFields?: Record<string, string | null>;
    }
  ): Promise<ApiResponse<Project>> {
    try {
      return await this.client.projects.update(projectId, options);
    } catch (error) {
      throw new Error(handleTimingApiError(error, `update project ${projectId}`));
    }
  }
  
  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      // Note: timing-api-client may need to be extended for delete endpoint
      // This is a placeholder - actual implementation depends on API client support
      throw new Error('Delete project endpoint not yet implemented in timing-api-client');
    } catch (error) {
      throw new Error(handleTimingApiError(error, `delete project ${projectId}`));
    }
  }
  
  /**
   * List time entries
   */
  async listTimeEntries(query?: {
    startDateMin?: string;
    endDateMax?: string;
    projects?: string[];
    includeChildProjects?: boolean;
    searchQuery?: string;
    isRunning?: boolean;
    includeProjectData?: boolean;
  }): Promise<ApiResponse<TimeEntry[]>> {
    try {
      return await this.client.timeEntries.list(query || {});
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'list time entries'));
    }
  }
  
  /**
   * Get a single time entry
   */
  async getTimeEntry(timeEntryId: string): Promise<ApiResponse<TimeEntry>> {
    try {
      return await this.client.timeEntries.get(timeEntryId);
    } catch (error) {
      throw new Error(handleTimingApiError(error, `get time entry ${timeEntryId}`));
    }
  }
  
  /**
   * Create a time entry
   */
  async createTimeEntry(options: {
    project: string;
    title: string;
    startDate: string;
    endDate?: string;
    notes?: string;
    billingStatus?: string;
    customFields?: Record<string, string | null>;
  }): Promise<ApiResponse<TimeEntry>> {
    try {
      return await this.client.timeEntries.create(options);
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'create time entry'));
    }
  }
  
  /**
   * Update a time entry
   */
  async updateTimeEntry(
    timeEntryId: string,
    options: {
      title?: string;
      startDate?: string;
      endDate?: string;
      notes?: string;
      billingStatus?: string;
      customFields?: Record<string, string | null>;
    }
  ): Promise<ApiResponse<TimeEntry>> {
    try {
      return await this.client.timeEntries.update(timeEntryId, options);
    } catch (error) {
      throw new Error(handleTimingApiError(error, `update time entry ${timeEntryId}`));
    }
  }
  
  /**
   * Delete a time entry
   */
  async deleteTimeEntry(timeEntryId: string): Promise<void> {
    try {
      // Note: timing-api-client may need to be extended for delete endpoint
      // This is a placeholder - actual implementation depends on API client support
      throw new Error('Delete time entry endpoint not yet implemented in timing-api-client');
    } catch (error) {
      throw new Error(handleTimingApiError(error, `delete time entry ${timeEntryId}`));
    }
  }
  
  /**
   * Start a timer
   */
  async startTimer(options: {
    project: string;
    title: string;
    startDate?: string;
    notes?: string;
  }): Promise<ApiResponse<TimeEntry>> {
    try {
      return await this.client.timeEntries.start(options);
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'start timer'));
    }
  }
  
  /**
   * Stop the current timer
   */
  async stopTimer(): Promise<ApiResponse<TimeEntry>> {
    try {
      return await this.client.timeEntries.stop();
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'stop timer'));
    }
  }
  
  /**
   * Generate a report
   */
  async generateReport(options: {
    startDateMin?: string;
    startDateMax?: string;
    projects?: string[];
    includeChildProjects?: boolean;
    searchQuery?: string;
    columns?: string[];
    projectGroupingLevel?: number;
    includeProjectData?: boolean;
    timespanGroupingMode?: string;
    sort?: string[];
  }): Promise<Report> {
    try {
      return await this.client.reports.generate(options);
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'generate report'));
    }
  }
  
  /**
   * List teams
   */
  async listTeams(): Promise<ApiResponse<Team[]>> {
    try {
      // Note: timing-api-client may need to be extended for teams endpoint
      // This is a placeholder - actual implementation depends on API client support
      throw new Error('List teams endpoint not yet implemented in timing-api-client');
    } catch (error) {
      throw new Error(handleTimingApiError(error, 'list teams'));
    }
  }
  
  /**
   * Get a team
   */
  async getTeam(teamId: string): Promise<ApiResponse<Team>> {
    try {
      // Note: timing-api-client may need to be extended for teams endpoint
      // This is a placeholder - actual implementation depends on API client support
      throw new Error('Get team endpoint not yet implemented in timing-api-client');
    } catch (error) {
      throw new Error(handleTimingApiError(error, `get team ${teamId}`));
    }
  }
}
