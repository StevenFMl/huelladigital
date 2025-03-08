"use server";

import { revalidatePath } from "next/cache";
import 'react-toastify/dist/ReactToastify.css';
import {createClient} from "@/utils/supabase/server";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Activo" | "Inactivo";
  fingerprintRegistered: boolean;
  cedula?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  cedula: string;
  password?: string;
  role: string;
  status: "Activo" | "Inactivo";
  fingerprintRegistered: boolean;
}

// Server actions
export async function getUsers() {
   const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const transformedUsers: User[] = data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      cedula: user.identification,
      role: user.rol,
      status: user.state ? "Activo" : "Inactivo",
      fingerprintRegistered: false,
    }));

    return { users: transformedUsers, error: null };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], error: "Failed to fetch users" };
  }
}

export async function createUser(userData: UserFormData) {
  const supabase = await createClient();

  try {
    const password = userData.password || userData.cedula || generateSecurePassword();
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error("No se obtuvo un ID de usuario después de la creación.");

    const { error: dbError } = await supabase
      .from('users')
      .insert({
        id: userId,
        name: userData.name,
        email: userData.email,
        identification: userData.cedula,
        rol: userData.role,
        state: userData.status === "Activo",
        created_at: new Date().toISOString()
      });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || "Error al crear usuario" };
  }
}

export async function updateUser(userId: string, userData: Omit<UserFormData, 'password'>) {
  const supabase = await createClient();
  
  try {
    const { error: authError } = await supabase.auth.admin.updateUserById(
      userId,
      { 

        email: userData.email,
        password:userData.cedula
      }
    );

    if (authError) throw authError;

    const { error: dbError } = await supabase
      .from('users')
      .update({
        name: userData.name,
        email: userData.email,
        identification: userData.cedula,
        rol: userData.role,
        state: userData.status === "Activo"
      })
      .eq('id', userId);

    if (dbError) throw dbError;

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return { success: false, error: error.message || "Failed to update user" };
  }
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();
  
  try {
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) console.warn("Could not delete from auth, proceeding with database deletion only:", authError);

    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (dbError) throw dbError;
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete user" };
  }
}
function generateSecurePassword(): string {
  throw new Error("Function not implemented.");
}

