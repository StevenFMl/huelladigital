"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Fingerprint } from "lucide-react"
import type { User } from "@/types/user"

interface UserFormProps {
  user?: User
  onSubmit: (userData: Omit<User, "id">) => void
}

export default function UserForm({ user, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    status: user?.status || "Activo",
    fingerprintRegistered: user?.fingerprintRegistered || false,
  })

  const [isScanning, setIsScanning] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleFingerprintScan = () => {
    setIsScanning(true)
  }

  const handleScanComplete = () => {
    setIsScanning(false)
    setFormData((prevData) => ({ ...prevData, fingerprintRegistered: true }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
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
            <SelectItem value="Usuario">Usuario</SelectItem>
            <SelectItem value="Motorizado">Motorizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Estado</Label>
        <Select
          name="status"
          value={formData.status}
          onValueChange={(value) => setFormData((prevData) => ({ ...prevData, status: value }))}
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
      <div>
        <Label>Huella Digital</Label>
        <div className="flex items-center space-x-2">
          <Button type="button" onClick={handleFingerprintScan} disabled={formData.fingerprintRegistered}>
            {formData.fingerprintRegistered ? "Huella Registrada" : "Registrar Huella"}
          </Button>
          {formData.fingerprintRegistered && <span className="text-sm text-green-600">✓ Registrada</span>}
        </div>
      </div>
      <Button type="submit">Guardar</Button>

      <Dialog open={isScanning} onOpenChange={setIsScanning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Huella Digital</DialogTitle>
            <DialogDescription>Por favor, coloque su dedo en el lector de huellas digitales</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <Fingerprint className="h-16 w-16 text-primary animate-pulse" />
            <p className="mt-4 text-sm text-gray-500">Escaneando huella digital...</p>
          </div>
          <Button onClick={handleScanComplete} className="mt-4">
            Simular Escaneo Exitoso
          </Button>
        </DialogContent>
      </Dialog>
    </form>
  )
}

