"use client"

import { useState, useEffect } from "react"
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
import { getUsers, createUser, updateUser, deleteUser,  } from "@/components/users/action"
import type { User, UserFormData } from "@/components/users/action"
import { toast } from "nextjs-toast-notify";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  async function loadUser(){
    setIsLoading(true)
    const { users: fetchedUsers, error } = await getUsers()
    setUsers(fetchedUsers)
    setIsLoading(false)
  }
  // Fetch users on component mount
  useEffect(() => {

  loadUser();
  }, [])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (confirm("¿Está seguro que desea eliminar este usuario?")) {
      const { success, error } = await deleteUser(userId)
      
      if (success) {
        toast.success(`¡Usuario Eliminado!`, {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });

        await loadUser();
      } else {
        toast.success(`¡Error: ${error} !`, {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      }
    }
  }

  const handleNewUser = () => {
    setSelectedUser(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (userData: UserFormData) => {
    setIsDialogOpen(false)
    
    if (selectedUser) {
      // Edit existing user
      const { success, error } = await updateUser(selectedUser.id, userData)
      
      if (success) {
        toast.success(`¡Usuario Actualizado!`, {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
        await loadUser();


      } else {
        toast.success(`¡Error: ${error} !`, {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      }
    } else {
      // Add new user
      const { success, error } = await createUser(userData)
      if(success==true){
        toast.success(`¡Usuario Creado!`, {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
        await loadUser();

      }else{
        toast.success(`¡Error: ${error} !`, {
          duration: 4000,
          progress: true,
          position: "top-right",
          transition: "bounceIn",
          icon: '',
          sound: true,
        });
      }

    }
  }

 
  

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(users.length / usersPerPage)

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando usuarios...</div>
  }

  return (
    <div className="h-screen bg-background">
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
            <TableHead>Cedula</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Huella Digital</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No hay usuarios registrados
              </TableCell>
            </TableRow>
          ) : (
            currentUsers.map((user) => (
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
                <TableCell>{user.cedula || "-"}</TableCell>
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
            ))
          )}
        </TableBody>
      </Table>

      {users.length > usersPerPage && (
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
      )}

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
