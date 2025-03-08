"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Truck, FileText, LogOut, ChevronRight } from "lucide-react";

const menuItems = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/dashboard/users", icon: Users, label: "Usuarios" },
  { href: "/dashboard/motorizado", icon: Truck, label: "Motorizados" },
  { href: "/dashboard/secretario", icon: FileText, label: "Secretaria" },
  { href: "/dashboard/reportes", icon: FileText, label: "Reportes" },
  { href: "/login", icon: LogOut, label: "Cerrar sesión" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-gradient-to-b from-background to-secondary/10">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary/20">
            <img src="/Logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">TurboExpress</span>
          </div>
        </div>
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.label !== "Cerrar sesión" && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}