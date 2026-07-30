import {
  Bell, Building2, ChartNoAxesColumnIncreasing, ChevronDown, ClipboardList,
  Gauge, Menu, MessageCircle, Settings, Users, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { NavKey, Role } from "../types";
import { Logo } from "./Logo";

const nav = [
  ["overview", "Overview", Gauge],
  ["spaces", "Spaces", Building2],
  ["alerts", "Alerts", Bell],
  ["work-orders", "Work orders", ClipboardList],
  ["residents", "Residents", Users],
  ["reports", "Reports", ChartNoAxesColumnIncreasing],
  ["settings", "Settings", Settings],
] as const;

interface ShellProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  alertCount: number;
  workOrderCount: number;
  buildingName: string;
  role: Role;
  onRoleChange: (role: Role) => void;
  children: ReactNode;
}

export function Shell({ active, onNavigate, alertCount, workOrderCount, buildingName, role, onRoleChange, children }: ShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
        <Logo />
        <button className="building-picker"><Building2 /> <span>{buildingName}</span><ChevronDown /></button>
        <div className="role-switch" aria-label="Portal view">
          {(["owner", "technician", "resident"] as Role[]).map((item) => <button key={item} className={role === item ? "active" : ""} onClick={() => onRoleChange(item)}>{item}</button>)}
        </div>
        <div className="topbar-spacer" />
        <span className="local-status"><i /> Demo data · saved locally</span>
        <button className="profile"><span>AM</span><b>Alex Morgan</b><ChevronDown /></button>
      </header>
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <nav aria-label="Primary navigation">
          {nav.map(([key, label, Icon]) => {
            const count = key === "alerts" ? alertCount : key === "work-orders" ? workOrderCount : 0;
            return (
              <button
                key={key}
                className={active === key ? "active" : ""}
                onClick={() => { onNavigate(key); setMenuOpen(false); }}
              >
                <Icon /><span>{label}</span>{count > 0 && <em>{count}</em>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-help"><MessageCircle /><div><b>Need context?</b><span>Every alert explains what changed.</span></div></div>
      </aside>
      <main className="page">{children}</main>
    </div>
  );
}
