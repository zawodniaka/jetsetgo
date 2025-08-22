'use client';

import {supabase} from "../../../supabaseClient";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useEffect } from "react";
import DestinationCards from "../popular_destinations/DestinationsCards";

export default function Users() {
    const router=useRouter();
    const [name, setName]=useState("");
    const [errorMessage, setErrorMessage]=useState("");
    //const [email, setEmail]=useState("");
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
            .from('users').select('first_name, last_name').eq('user_id', userId).single();

            setName(`Welcome, ${userName.first_name} ${userName.last_name}!`);
       
    }

    function welcomeRedirect(){
        router.push('/booking');
    }

    useEffect(() => {
        getName();

    }, []);
    
    return (

        <div className="min-h-screen min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            {/* Large white container */}
            <div className="mt-10 p-8 rounded-xl flex flex-col items-center gap-12 bg-white w-full max-w-6xl shadow-lg mx-auto">

                <div id='userPageBody'>
                    <h1 className="font-bold">{name}</h1>
                    <p>{errorMessage}</p>
                    <br></br><br></br>
                    <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-lg font-semibold py-2 px-3 rounded-lg transition duration-200" onClick={welcomeRedirect}>Start Planning</button>
                </div>  

                <DestinationCards  />
            </div>
        </div>
    )
}