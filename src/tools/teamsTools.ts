/**
 * MCP tools for Teams management
 * Provides access to Timing teams
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { TimingApiService } from '../services/timingApi.js';
import { formatTimingError } from '../utils/errorHandler.js';

// Schema for list_teams tool (no parameters needed)
const ListTeamsSchema = z.object({});

// Schema for get_team tool
const GetTeamSchema = z.object({
  id: z.string().describe('The ID of the team')
});

/**
 * Tool: timing_list_teams
 * List all teams
 */
export const listTeamsTool = {
  name: 'timing_list_teams',
  description: 'List all teams you are a member of in Timing',
  inputSchema: zodToJsonSchema(ListTeamsSchema),
  handler: async (): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const response = await apiService.listTeams();
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error listing teams: ${formatTimingError(error)}`;
    }
  }
};

/**
 * Tool: timing_team
 * Get details of a specific team
 */
export const getTeamTool = {
  name: 'timing_team',
  description: 'Get detailed information about a specific team by ID',
  inputSchema: zodToJsonSchema(GetTeamSchema),
  handler: async (params: z.infer<typeof GetTeamSchema>): Promise<string> => {
    try {
      const apiService = new TimingApiService();
      const teamId = params.id.replace(/^\/teams\//, '');
      const response = await apiService.getTeam(teamId);
      
      return JSON.stringify(response, null, 2);
    } catch (error) {
      return `Error getting team: ${formatTimingError(error)}`;
    }
  }
};
