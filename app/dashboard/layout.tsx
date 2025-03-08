import React from "react";
import Sidebar from "@/components/dashboard/Sidebar"; // Asegúrate de que la ruta sea correcta
import TopBar from "@/components/dashboard/TopBar";
import {loadUserInformation} from "@/components/layout";

export default async function Layout({ children }: { children: React.ReactNode }) {
    let rol:string = "Admin";
    let response = await loadUserInformation();
    rol=response;
    // peticion para obtener la informacion del usuario
  return (
    <div className="flex">
      <Sidebar rol={rol} />
      <div className="flex-1">
      <TopBar />
      <main className="flex-1 p-6">{children}</main>
    </div>
    </div>
  );
}