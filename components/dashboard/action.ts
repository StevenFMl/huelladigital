'use server'

import {createClient} from "@/utils/supabase/server";
export interface RecentUser{
    id:string,
    name:string,
    email:string,
    created_at:string,
    identification:string,
    rol:string,
    state:boolean
}

export async function loadTotalUsersValues(){
    const supabase = await createClient();
    const {data, error} = await supabase.from('users').select("rol");
    if(error){
        return {
            total:0,
            motorizados:0,
            secretario:0
        }
    }
    let motorizados = 0;
    let secretario = 0;
    for (let i = 0; i < data!.length; i++) {
        const item = data[i];
        if(item.rol=="Motorizado"){
            motorizados+=1;
        }else if (item.rol =="Secretario"){
            secretario+=1;
        }

    }
    return {
        total: data!.length,
        motorizados,
        secretario
    }


}

export async function loadRecentUsers():Promise<RecentUser[]>{
    const supabase = await createClient();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateParsed = `${year}-${month}-${day}`
    const {data, error} = await supabase.from('reports').select("*,user_id (*)").eq('date', dateParsed)
        .not('enter', 'is', null).limit(10)
    if(error){
        return []
    }
    const users:any = data?.map((item)=>{
        return item.user_id;
    })
    return users  as RecentUser[];
}



export async function logoutOfSupabase(){
    const supabase = await createClient();

    await supabase.auth.signOut();
}