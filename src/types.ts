export type Severity = "critical" | "attention" | "info";
export type NavKey = "overview" | "spaces" | "alerts" | "work-orders" | "residents" | "reports" | "settings";
export type Role = "owner" | "technician" | "resident";

export type Trade =
  | "HVAC"
  | "Plumbing"
  | "Electrical"
  | "Appliance"
  | "General repair"
  | "Inspection"
  | "Landscaping"
  | "Pest control"
  | "Locksmith"
  | "Life safety";

export interface ServiceRequest {
  id: string;
  resident: string;
  unit: string;
  property: string;
  summary: string;
  details: string;
  trade: Trade;
  confidence: number;
  responsibility: "building" | "resident" | "review";
  availability: string[];
  preferredTechnician?: string;
  assignedTechnician?: string;
  scheduledSlot?: string;
  status: "triage" | "offered" | "accepted" | "scheduled" | "in-progress" | "completed";
  estimatedPay: number;
}

export interface Technician {
  id: string;
  name: string;
  trades: Trade[];
  rating: number;
  jobsThisWeek: number;
  available: string[];
}

export interface Zone {
  id: string;
  name: string;
  floor: string;
  type: string;
  temperature: number;
  setpoint: number;
  occupancy: number;
  humidity: number;
  trend: number[];
}

export interface Alert {
  id: string;
  zoneId: string;
  title: string;
  reason: string;
  severity: Severity;
  detectedAt: string;
  status: "open" | "acknowledged" | "resolved";
}

export interface WorkOrder {
  id: string;
  title: string;
  location: string;
  priority: "high" | "medium" | "low";
  status: "open" | "scheduled" | "done";
  assignee: string;
  createdAt: string;
  sourceAlertId?: string;
}

export interface ResidentRequest {
  id: string;
  resident: string;
  unit: string;
  message: string;
  createdAt: string;
  status: "new" | "in-review" | "closed";
}

export interface Settings {
  buildingName: string;
  comfortLow: number;
  comfortHigh: number;
  notifications: boolean;
  reducedMotion: boolean;
}
