import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { localDb } from '../services/localDatabase.js';

const GetGranularActivitySchema = z.object({
  from: z.string().describe('Start date (ISO 8601) or relative time (today, yesterday, week_start, month_start)'),
  to: z.string().describe('End date (ISO 8601) or relative time (now, today_end, yesterday_end)'),
  limit: z.number().optional().describe('Limit number of results (default 100)')
});

// Helper to parse date string to unix timestamp
function parseDateParam(input: string): number {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  switch (input) {
    case 'now':
      return Date.now() / 1000;
    case 'today':
    case 'today_start':
      return todayStart.getTime() / 1000;
    case 'today_end': {
      const d = new Date(todayStart);
      d.setHours(23, 59, 59, 999);
      return d.getTime() / 1000;
    }
    case 'yesterday':
    case 'yesterday_start': {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - 1);
      return d.getTime() / 1000;
    }
    case 'yesterday_end': {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - 1);
      d.setHours(23, 59, 59, 999);
      return d.getTime() / 1000;
    }
    case 'week_start': {
      const d = new Date(todayStart);
      const day = d.getDay(); // 0 is Sunday
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      d.setDate(diff);
      return d.getTime() / 1000;
    }
    case 'month_start': {
      const d = new Date(todayStart);
      d.setDate(1);
      return d.getTime() / 1000;
    }
  }

  // Try parsing as ISO
  const d = new Date(input);
  if (!isNaN(d.getTime())) {
    return d.getTime() / 1000;
  }

  throw new Error(`Invalid date format: ${input}`);
}

export const getGranularActivityTool = {
  name: 'timing_get_granular_app_activity',
  description: 'Get granular application usage (window titles, paths) from local Timing database. Useful for detailed "what was I doing" queries that the official API might abstract away.',
  inputSchema: zodToJsonSchema(GetGranularActivitySchema),
  handler: async (params: z.infer<typeof GetGranularActivitySchema>): Promise<string> => {
     try {
       const from = parseDateParam(params.from);
       const to = parseDateParam(params.to);
       
       const activities = await localDb.getAppActivity(from, to, params.limit || 100);
       
       // Format dates for human readability in JSON
       const humanReadable = activities.map(a => ({
           ...a,
           startDateStr: new Date(a.startDate * 1000).toLocaleString(),
           endDateStr: new Date(a.endDate * 1000).toLocaleString(),
           duration: (a.endDate - a.startDate).toFixed(1) + 's'
       }));

       return JSON.stringify(humanReadable, null, 2);
     } catch (err) {
       return `Error querying local database: ${err instanceof Error ? err.message : String(err)}`;
     }
  }
};
