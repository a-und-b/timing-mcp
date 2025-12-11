import { exec } from 'child_process';
import { promisify } from 'util';
import { homedir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

const DB_PATH = join(homedir(), 'Library/Application Support/info.eurocomp.Timing2/SQLite.db');

export interface AppActivityRow {
  startDate: number;
  endDate: number;
  appName: string | null;
  windowTitle: string | null;
  filePath: string | null;
  projectName: string | null;
}

export class LocalDatabaseService {
  private dbPath: string;

  constructor(dbPath: string = DB_PATH) {
    this.dbPath = dbPath;
  }

  private async runQuery(query: string, params: (string | number)[] = []): Promise<any[]> {
    // Escape single quotes in params for CLI safety (basic sanitization)
    // Note: robust SQL injection prevention with sqlite3 CLI is tricky, 
    // but we are running local read-only queries with numeric/trusted inputs mostly.
    // For string inputs, we must be careful.
    
    // Construct the command
    // We use -json to get easy to parse output
    const sql = query.replace(/\?/g, () => {
        const param = params.shift();
        if (typeof param === 'number') return param.toString();
        if (param === null || param === undefined) return 'NULL';
        // Basic escaping for single quotes
        return `'${String(param).replace(/'/g, "''")}'`;
    });

    const command = `sqlite3 -json "${this.dbPath}" "${sql.replace(/"/g, '\\"')}"`;

    try {
      const { stdout } = await execAsync(command);
      if (!stdout.trim()) return [];
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Database query failed:', error);
      throw new Error(`Failed to execute query: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getAppActivity(
    from: number, 
    to: number, 
    limit: number = 100
  ): Promise<AppActivityRow[]> {
    const query = `
      SELECT
        AppActivity.startDate,
        AppActivity.endDate,
        Application.title as appName,
        Title.stringValue as windowTitle,
        Path.stringValue as filePath,
        Project.title as projectName
      FROM AppActivity
      LEFT JOIN Application ON AppActivity.applicationID = Application.id
      LEFT JOIN Title ON AppActivity.titleID = Title.id
      LEFT JOIN Path ON AppActivity.pathID = Path.id
      LEFT JOIN Project ON AppActivity.projectID = Project.id
      WHERE AppActivity.startDate >= ? AND AppActivity.endDate <= ?
      ORDER BY AppActivity.startDate DESC
      LIMIT ?
    `;

    return this.runQuery(query, [from, to, limit]);
  }

  async getRecentActivity(limit: number = 50): Promise<AppActivityRow[]> {
    // Default to last 24 hours if searching generically, but here we just use limit
    // We'll set a far past date as 'from' and far future as 'to' effectively
    const now = Date.now() / 1000;
    const yesterday = now - 24 * 60 * 60;
    
    return this.getAppActivity(yesterday, now + 3600, limit);
  }
}

export const localDb = new LocalDatabaseService();
