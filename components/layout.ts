'use server'

import {createClient} from "@/utils/supabase/server";

export async function loadUserInformation(){
    const supabase = await createClient();
    const responseUser = await supabase.auth.getUser();
    const idUser = await responseUser.data.user?.id;
    const resultUser = await supabase.from('users').select("rol").eq("id",idUser);

    return resultUser.data![0].rol;

}