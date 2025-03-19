"use client"

import type React from "react"
import { useState } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, UserFormData } from "@/components/users/action"

interface UserFormProps {
  user?: User
  onSubmit: (userData: UserFormData) => void
}

export default function UserForm({ user, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || "",
    email: user?.email || "",
    cedula: user?.cedula || "",
    role: user?.role || "",
    status: user?.status || "Activo",
    id_hikvision: user?.id_hikvision|| 0,
    fingerprintRegistered: user?.fingerprintRegistered || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Si estamos creando un nuevo usuario, usamos la cédula como contraseña
    const submitData = user ? formData : { ...formData, password: formData.cedula }

    try {
      onSubmit(submitData)
      toast.success("Usuario guardado exitosamente!") // Mensaje de éxito
    } catch (error) {
      toast.error("Error al guardar el usuario") // Mensaje de error
    }
  }

  return (
    <>
      <ToastContainer /> {/* Contenedor de notificaciones */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="cedula">Cedula</Label>
          <Input id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="id_hikvision">Id HikVision</Label>
          <Input id="id_hikvision" name="id_hikvision" type="text" value={formData.id_hikvision} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="role">Rol</Label>
          <Select
            name="role"
            value={formData.role}
            onValueChange={(value) => setFormData((prevData) => ({ ...prevData, role: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Secretario">Secretario</SelectItem>
              <SelectItem value="Motorizado">Motorizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Estado</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => setFormData((prevData) => ({ ...prevData, status: value as "Activo" | "Inactivo" }))}  
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div></div>
        <Button type="submit">Guardar</Button>
      </form>
    </>
  )
}