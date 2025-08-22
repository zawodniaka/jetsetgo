"use client";
import {supabase} from "../../../supabaseClient";
import { useState,useEffect} from "react";
import Link from 'next/link'

export default function Admin() 
{   
    const [name, setName]=useState("");
    const [errorMessage, setErrorMessage]=useState("");
    const [userId, setUserId] = useState(null);

    async function getName(){

        const {data: userData, error}= await supabase.auth.getUser();

        if(userData==null||error){
            setName("Not signed in");
            setErrorMessage(error.message);
            setUserId("error");
            return;
        }
        
        const userId = userData.user.id;
        setUserId(userId);

        const { data: userName } = await supabase
            .from('users').select('first_name').eq('user_id', userId).single();

            setName(`Welcome, ${userName.first_name}!`);
       
    }
           
     useEffect(() => {
            getName();
    
        }, []);
        
    return(
        <div className="min-h-screen min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            {/* Large white container */}
            <div className="mt-10 p-8 rounded-xl flex flex-col items-center gap-12 bg-white w-170 max-w-6xl shadow-lg mx-auto">
               <h1 className="text-[35px] text-black font-bold">{name}</h1> 
                       <div className="w-full mt-3">

          <div className=" w-150 flex justify-center-safe gap-2 items-center">
            <div className="flex-1 bg-gray-100 rounded-xl border-black border-1 overflow-hidden shadow text-center">
                <Link href="/admin/usersinfo">
              <img src="../users.png" all="Users" className="w-full h-48 object-cover"/>
              </Link>
              <div className="p-4">
                <h3 className="text-[20px] font-bold mb-2 text-black">View Users</h3>
              </div>
            </div>
             <div className="flex-1 bg-gray-100 rounded-xl border-black border-1 overflow-hidden shadow text-center">
                <Link href ="/users/profile">
              <img src="../user_icon.png" all="My Profile" className="mx-auto w-50 h-48"/>
              </Link>
              <div className="p-4">
                <h3 className="text-[20px] font-bold mb-2 text-black">My Profile</h3>
              </div>
            </div>
            </div>
             </div>
            </div>
        </div>
    )
}