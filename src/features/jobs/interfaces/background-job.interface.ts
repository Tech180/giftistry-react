export type BackgroundJobStatus =
  | 'queued'
  | 'running'
  | 'suspended'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type BackgroundJobPhase =
  | 'queued'
  | 'parsing'
  | 'creating_list'
  | 'adding_items'
  | 'grabbing_info'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'suspended';

export interface JobItemsSummary {
  Total: number;
  Pending: number;
  Running: number;
  Done: number;
  Failed: number;
  Skipped: number;
}

export interface JobActiveStream {
  Id: string;
  ItemId: string | null;
  Label: string;
  Status: 'pending' | 'running' | 'done' | 'failed' | 'skipped';
}

export interface BackgroundJobView {
  Id: string;
  Kind: string;
  ListId: string | null;
  UserId: string;
  Status: BackgroundJobStatus;
  Phase: BackgroundJobPhase;
  ProgressDone: number;
  ProgressTotal: number;
  Message: string;
  Error: string | null;
  Result?: Record<string, unknown>;
  CreatedAt?: string;
  UpdatedAt?: string;
  StartedAt?: string | null;
  FinishedAt?: string | null;
  GrabInfo?: boolean;
  Mode?: string;
  FileName?: string;
  ItemsSummary?: JobItemsSummary;
  ActiveStreams?: JobActiveStream[];
}
