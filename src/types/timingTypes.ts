/**
 * TypeScript type definitions for Timing API responses and tool parameters
 */

/**
 * Billing status for time entries
 */
export type BillingStatus = 'billable' | 'not_billable' | 'billed' | 'paid';

/**
 * Project reference (can be ID, reference string, or title chain)
 */
export type ProjectReference = string | string[];

/**
 * Custom fields object
 */
export interface CustomFields {
  [key: string]: string | null;
}

/**
 * Project data structure
 */
export interface Project {
  self: string;
  team_id: string | null;
  title: string;
  title_chain: string[];
  color: string;
  productivity_score: number;
  is_archived: boolean;
  notes: string | null;
  children?: Project[];
  parent?: {
    self: string;
  } | null;
  default_billing_status?: BillingStatus;
  custom_fields?: CustomFields;
}

/**
 * Time entry data structure
 */
export interface TimeEntry {
  self: string;
  project: {
    self: string;
    title?: string;
    title_chain?: string[];
  };
  title: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  billing_status?: BillingStatus;
  custom_fields?: CustomFields;
}

/**
 * Team data structure
 */
export interface Team {
  self: string;
  name: string;
  // Add other team fields as needed
}

/**
 * Report data structure
 */
export interface Report {
  data: unknown[];
  links?: {
    [key: string]: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  links?: {
    [key: string]: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}
