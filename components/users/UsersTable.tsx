"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash, UserPlus, ChevronLeft, ChevronRight, Fingerprint } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import UserForm from "./UsersForm"
import type { User } from "@/types/user"

// Mock data for users (expanded to more than 10 for demonstration)
const initialUsers: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Activo",
    fingerprintRegistered: false,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Secretaria",
    status: "Inactivo",
    fingerprintRegistered: true,
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "Motorizado",
    status: "Activo",
    fingerprintRegistered: false,
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    role: "Admin",
    status: "Activo",
    fingerprintRegistered: true,
  },
  {
    id: 5,
    name: "Eva Martinez",
    email: "eva@example.com",
    role: "Secretaria",
    status: "Activo",
    fingerprintRegistered: false,
  },
  {
    id: 6,
    name: "Frank Thomas",
    email: "frank@example.com",
    role: "Motorizado",
    status: "Inactivo",
    fingerprintRegistered: true,
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace@example.com",
    role: "Admin",
    status: "Activo",
    fingerprintRegistered: false,
  },
  {
    id: 8,
    name: "Henry Garcia",
    email: "henry@example.com",
    role: "Secretaria",
    status: "Activo",
    fingerprintRegistered: true,
  },
  {
    id: 9,
    name: "Isabel Rodriguez",
    email: "isabel@example.com",
    role: "Motorizado",
    status: "Activo",
    fingerprintRegistered: false,
  },
  {
    id: 10,
    name: "Jack Thompson",
    email: "jack@example.com",
    role: "Admin",
    status: "Inactivo",
    fingerprintRegistered: true,
  },
  {
    id: 11,
    name: "Karen Davis",
    email: "karen@example.com",
    role: "Secretaria",
    status: "Activo",
    fingerprintRegistered: false,
  },
  {
    id: 12,
    name: "Liam Wilson",
    email: "liam@example.com",
    role: "Motorizado",
    status: "Activo",
    fingerprintRegistered: true,
  },
]

export default function UsersTable() {
  const [users, setUsers] = useState(initialUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleNewUser = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = (userData: Omit<User, "id">) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, ...userData } : user)))
    } else {
      // Add new user
      const newUser = { ...userData, id: Math.max(...users.map((u) => u.id)) + 1 }
      setUsers([...users, newUser])
    }
    setIsDialogOpen(false)
  }

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(users.length / usersPerPage)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <Button onClick={handleNewUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Registrar Nuevo Usuario
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Huella Digital</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge variant={user.status === "Activo" ? "default" : "secondary"}>{user.status}</Badge>
              </TableCell>
              <TableCell>
                {user.fingerprintRegistered ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    <Fingerprint className="mr-1 h-3 w-3" />
                    Registrada
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    No Registrada
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(user)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDelete(user.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Editar Usuario" : "Registrar Nuevo Usuario"}</DialogTitle>
          </DialogHeader>
          <UserForm user={selectedUser || undefined} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

