"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { PieChart, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {useEffect, useState} from "react";
import {loadRecentUsers, loadTotalUsersValues, RecentUser} from "@/components/dashboard/action";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [dataUsers, setDataUsers] = useState({
    total:0,
    motorizados:0,
    secretario:0,
  });
  const [recentUsers, setRecentUsers] = useState<List<RecentUser>>([])
  async function loadData(){
    const [total, users] = await Promise.all([
        loadTotalUsersValues(),
        loadRecentUsers()
    ])
    console.log( users)
    setDataUsers(total)
    setRecentUsers(users)

  }
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[
              { title: "Total Usuarios", value: dataUsers.total, icon: Users },
              { title: "Total Motorizados", value:dataUsers.motorizados, icon: PieChart },
              { title: "Total Secretaria", value: dataUsers.secretario, icon: Settings },
            ].map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((item:RecentUser) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://randomuser.me/api/portraits/men/${item}.jpg`} />
                            <AvatarFallback>{item.name.substring(0,1)}</AvatarFallback>
                          </Avatar>
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {item.rol}
                        </span>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}