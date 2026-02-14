const fs = require('fs');
const path = require('path');

const dir = __dirname;
const inner = fs.readFileSync(path.join(dir, 'dashboard_inner.txt'), 'utf8');

const header = `/**
 * Section Tableau de bord du dashboard DSI/Admin.
 * Vue principale avec KPIs, métriques et graphiques.
 */

import React from "react";
import { Clock3, TrendingUp, UserCheck, Star } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { CustomLabel } from "../ui/CustomLabel.tsx";
import type { Ticket, Technician } from "../../types";

export type DashboardSectionProps = {
  userRole: string | null;
  pendingCount: number;
  activeTechniciansCount: number;
  technicians: Technician[];
  metrics: { avgResolutionTime?: string | null; userSatisfaction?: string | null };
  resolutionRate: string;
  totalTicketsCount: number;
  filteredTickets: Ticket[];
  formatTicketNumber: (n: number) => string;
  loadTicketDetails: (id: string) => void;
  loading: boolean;
  openActionsMenuFor: string | null;
  setOpenActionsMenuFor: (v: string | null) => void;
  setActionsMenuPosition: (v: { top: number; left: number } | null) => void;
  prepareWeeklyTicketsData: () => { jour: string; Créés: number; Résolus: number }[];
  prepareMonthlyEvolutionData: () => { mois: string; Matériel: number; Applicatif: number }[];
  preparePriorityData: () => { name: string; value: number; percentage: number }[];
  prepareStatusData: () => { name: string; value: number; percentage: number }[];
  prepareAgencyAnalysisData: () => { agence: string; Total: number; Résolus: number; "En attente": number }[];
  prepareTechnicianPerformanceData: () => { technicien: string; performance: number; avgTimeHours: number; performancePercent: number }[];
  prepareTimeSeriesData: () => { date: string; créés: number; résolus: number }[];
  prepareStatusEvolutionData: () => { date: string; "En attente": number; "En cours": number; "Résolus": number; "Clôturés": number }[];
  prepareResolutionTimeByTypeData: () => { type: string; tempsMoyen: number }[];
  allTickets?: Ticket[];
};

export function DashboardSection(props: DashboardSectionProps) {
  const {
    userRole,
    pendingCount,
    activeTechniciansCount,
    technicians,
    metrics,
    resolutionRate,
    totalTicketsCount,
    filteredTickets,
    formatTicketNumber,
    loadTicketDetails,
    loading,
    openActionsMenuFor,
    setOpenActionsMenuFor,
    setActionsMenuPosition,
    prepareWeeklyTicketsData,
    prepareMonthlyEvolutionData,
    preparePriorityData,
    prepareStatusData,
    prepareAgencyAnalysisData,
    prepareTechnicianPerformanceData,
    prepareTimeSeriesData,
    prepareStatusEvolutionData,
    prepareResolutionTimeByTypeData,
    allTickets = [],
  } = props;

  return (
<>
`;

const footer = `
</>
  );
}
`;

fs.writeFileSync(path.join(dir, 'DashboardSection.tsx'), header + inner + footer);
console.log('Created DashboardSection.tsx');
