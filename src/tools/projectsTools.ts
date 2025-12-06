/**
 * MCP tools for Projects management
 * Provides CRUD operations for Timing projects
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TimingApiService } from '../services/timingApi.js';
import { formatTimingError } from '../utils/errorHandler.js';

// Schema for list_projects tool
const ListProjectsSchema = z.object({
  title: z.string().optional().describe('Filter by project title (case-insensitive search)'),
  hideArchived: z.boolean().optional().describe('Hide archived projects'),
  teamId: z.string().optional().describe('Filter by team ID')
});

// Schema for get_project tool
const GetProjectSchema = z.object({
  id: z.string().describe('The ID of the project (can be project reference like "/projects/1" or just "1")')
});

// Schema for create_project tool
const CreateProjectSchema = z.object({
  title: z.string().min(1).describe('Title of the project'),
  parent: z.string().optional().describe('Parent project reference (e.g., "/projects/1") or title'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().describe('Color in hexadecimal format (e.g., "#FF0000")'),
  notes: z.string().optional().describe('Notes for the project'),
  productivityScore: z.number().min(-1).max(1).optional().describe('Productivity score between -1 and 1'),
  isArchived: z.boolean().optional().describe('Whether the project is archived'),
  teamId: z.string().optional().describe('Team ID to add the project to'),
  defaultBillingStatus: z.enum(['billable', 'not_billable']).optional().describe('Default billing status for new time entries'),
  customFields: z.record(z.string(), z.string().nullable()).optional().describe('Custom fields as key-value pairs')
});

// Schema for update_project tool
const UpdateProjectSchema = z.object({
  projectId: z.string().describe('The ID of the project to update'),
  title: z.string().min(1).optional().describe('New title for the project'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().describe('New color in hexadecimal format'),
  notes: z.string().optional().describe('New notes for the project'),
  productivityScore: z.number().min(-1).max(1).optional().describe('New productivity score between -1 and 1'),
  isArchived: z.boolean().optional().describe('New archived status'),
  defaultBillingStatus: z.enum(['billable', 'not_billable']).optional().describe('New default billing status'),
  customFields: z.record(z.string(), z.string().nullable()).optional().describe('Custom fields to update (set to null to remove)')
});

// Schema for delete_project tool
const DeleteProjectSchema = z.object({
  projectId: z.string().describe('The ID of the project to delete')
});

// Schema for list_projects_hierarchy tool
const ListProjectsHierarchySchema = z.object({
  teamId: z.string().optional().describe('Filter by team ID')
});

/**
 * Tool: timing_list_projects
 * List all projects with optional filtering
 */
export const listProjectsTool = {
  name: 'timing_list_projects',
  description: 'List all projects in Timing with optional filtering by title, archived status, or team',
  inputSchema: zodToJsonSchema(ListProjectsSchema),
  handler: async (params: z.infer<typeof ListProjectsSchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const response = await apiService.listProjects({
        title: params.title,
        hideArchived: params.hideArchived,
        teamId: params.teamId
      });
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error listing projects: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_project
 * Get details of a specific project
 */
export const getProjectTool = {
  name: 'timing_project',
  description: 'Get detailed information about a specific project by ID',
  inputSchema: zodToJsonSchema(GetProjectSchema),
  handler: async (params: z.infer<typeof GetProjectSchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      // Extract project ID from reference if needed (e.g., "/projects/1" -> "1")
      const projectId = params.id.replace(/^\/projects\//, '');
      const response = await apiService.getProject(projectId);
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error getting project: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_create_project
 * Create a new project
 */
export const createProjectTool = {
  name: 'timing_create_project',
  description: 'Create a new project in Timing',
  inputSchema: zodToJsonSchema(CreateProjectSchema),
  handler: async (params: z.infer<typeof CreateProjectSchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const response = await apiService.createProject({
        title: params.title,
        parent: params.parent,
        color: params.color,
        notes: params.notes,
        productivityScore: params.productivityScore,
        isArchived: params.isArchived,
        teamId: params.teamId,
        defaultBillingStatus: params.defaultBillingStatus,
        customFields: params.customFields
      });
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error creating project: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_update_project
 * Update an existing project
 */
export const updateProjectTool = {
  name: 'timing_update_project',
  description: 'Update an existing project in Timing',
  inputSchema: zodToJsonSchema(UpdateProjectSchema),
  handler: async (params: z.infer<typeof UpdateProjectSchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const projectId = params.projectId.replace(/^\/projects\//, '');
      const response = await apiService.updateProject(projectId, {
        title: params.title,
        color: params.color,
        notes: params.notes,
        productivityScore: params.productivityScore,
        isArchived: params.isArchived,
        defaultBillingStatus: params.defaultBillingStatus,
        customFields: params.customFields
      });
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error updating project: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_delete_project
 * Delete a project
 */
export const deleteProjectTool = {
  name: 'timing_delete_project',
  description: 'Delete a project from Timing',
  inputSchema: zodToJsonSchema(DeleteProjectSchema),
  handler: async (params: z.infer<typeof DeleteProjectSchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const projectId = params.projectId.replace(/^\/projects\//, '');
      await apiService.deleteProject(projectId);
      
      return `Project ${projectId} deleted successfully`;
    } catch (error) {
      return `Error deleting project: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_list_projects_hierarchy
 * Get hierarchical project structure
 */
export const listProjectsHierarchyTool = {
  name: 'timing_list_projects_hierarchy',
  description: 'Get the complete hierarchical project structure with parent-child relationships',
  inputSchema: zodToJsonSchema(ListProjectsHierarchySchema),
  handler: async (params: z.infer<typeof ListProjectsHierarchySchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const response = await apiService.listProjectsHierarchy(params.teamId);
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error listing project hierarchy: ${formatTimingError(error)}`;
    }
  }
};
