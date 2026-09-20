export interface OverviewStats {
  Users: {
    Total: number;
    Active: number;
    Disabled: number;
    Unverified: number;
    Admins: number;
    New30d: number;
    Active7d: number;
    Locked: number;
  };
  Lists: { Total: number; Active: number };
  Comments: number;
  OpenReports: number;
  MaintenanceMode: boolean;
}
