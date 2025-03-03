import React from "react";
import Sidebar from "@/components/dashboard/Sidebar"; // Asegúrate de que la ruta sea correcta
import TopBar from "@/components/dashboard/TopBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
      <TopBar />
      <main className="flex-1 p-6">{children}</main>
    </div>
    </div>
  );
}