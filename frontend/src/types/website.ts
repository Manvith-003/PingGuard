export interface Website {
  _id: string;
  name: string;
  url: string;
  status: "UP" | "DOWN";
  responseTime?: number;
  lastChecked?: string;
  uptimeCount: number;
  downtimeCount: number;
}