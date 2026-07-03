export type SegmentCode = "prod" | "idle" | "stop";

export interface LegendItem {
  code: SegmentCode;
  label: string;
  color: string;
  pct: number;
}

export type GanttSegment = [SegmentCode, number];

export interface GanttDay {
  d: string;
  segs: GanttSegment[];
  fullDate?: string;
}

export interface Uptime {
  h: number;
  m: number;
}

export interface Reactor {
  id: string;
  name: string;
  clr: string;
  uptime: Uptime;
  gantt: GanttDay[];
}

export interface PlantData {
  name: string;
  legend: LegendItem[];
  reactors: Reactor[];
}
