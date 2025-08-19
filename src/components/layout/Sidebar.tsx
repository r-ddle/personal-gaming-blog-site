"use client";

import {
  IconHome,
  IconDeviceGamepad,
  IconPhoto,
  IconSettings,
  IconMoon,
  IconSun
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setMounted(true);
  }, []);

  const baseNavItems = [
    { name: "Home", path: "/", icon: IconHome },
    { name: "Games", path: "/games", icon: IconDeviceGamepad },
    { name: "Gallery", path: "/gallery", icon: IconPhoto },
  ];

  const adminNavItems = [
    { name: "Admin", path: "/admin", icon: IconSettings },
  ];

  const navItems = mounted && authenticated
    ? [...baseNavItems, ...adminNavItems]
    : baseNavItems;

  return (
    <nav id="sidebar" className="sidebar-always-dark" aria-label="Navigation">
      <div id="sidebar-tabs" role="tablist">
        <div id="sidebar-actions" className="sidebar-inner-container">
          {navItems.map((item) => (
            <SidebarTab
              key={item.path}
              name={item.name}
              path={item.path}
              icon={item.icon}
              isActive={pathname === item.path}
              theme={theme}
            />
          ))}
        </div>

        <div id="sidebar-info" className="sidebar-inner-container">
          <button
            onClick={toggleTheme}
            className="sidebar-tab theme-toggle"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <div className="sidebar-tab-icon">
              {theme === "light" ? <IconMoon size={20} /> : <IconSun size={20} />}
            </div>
            <span className="sidebar-tab-text">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

interface SidebarTabProps {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number }>;
  isActive: boolean;
  theme: string;
}

function SidebarTab({ name, path, icon: Icon, isActive, theme }: SidebarTabProps) {
  return (
    <Link
      href={path}
      className={`sidebar-tab ${isActive ? "active" : ""}`}
      role="tab"
      aria-selected={isActive}
    >
      <div className="sidebar-tab-icon">
        <Icon size={20} />
      </div>
      <span className="sidebar-tab-text">{name}</span>
    </Link>
  );
}
