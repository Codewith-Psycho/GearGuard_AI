
export enum Priority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum KanbanStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  REPAIRED = 'REPAIRED',
  SCRAP = 'SCRAP'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'error';
  isRead: boolean;
}

export interface Ticket {
  id: string;
  equipmentName: string;
  technician: {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
  };
  priority: Priority;
  status: KanbanStatus;
  isOverdue: boolean;
  createdAt: string;
}

export interface EquipmentHealthData {
  name: string;
  health: number;
  prediction: string;
  trend: number[];
}

export interface StatItem {
  value: string | number;
  label: string;
  gradient: string;
  trend?: number;
  percentage?: number;
}
