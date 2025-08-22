'use client';

//import { useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import { useRouter, useSearchParams } from 'next/navigation';
//import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page(){
    //these let the state change immediately
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const rawMessage = searchParams.get('message');
        if (rawMessage) {
            setMessage(decodeURIComponent(rawMessage));
        }
    }, [searchParams]);

    async function checkCredentials(e){
        e.preventDefault();
        
        const {error}= await supabase.auth.signInWithPassword({email, password});
        if(error){
            //gives an error message
            alert("Error: "+error.message);
        } else {
            //gets the user that just signed in, checks if they're an admin
            const {user}=await (await supabase.auth.getUser()).data;
            const {error, data}=await supabase.from('users').select('admin').eq('user_id', user.id);
            const isAdmin=data.pop().admin;

            //if user is Admin redirect to /admin, else:
            if(isAdmin){
                window.location.href='/admin';
            }else{
                //Reloads navbar (to change elements) and redirects users to home page
                window.location.href = '/users';
            }
        }
    }

    //here the main thing of note is the onChange methods. They will automatically update the 
    //state (and the value) of the above vars.
    return (
        <div id="loginPage">
      
            {message && (
                <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                    {message}
                </div>
            )}
            
                <form id="loginBody" onSubmit={checkCredentials} 
                style={{backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '30px',
                    marginTop: '55px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    fontfamily: 'sans-serif',
                    color: 'black'}}>

                    <h1 id="loginHeader">Login</h1>

                    <label id='loginLabel' htmlFor='loginEmail'>Email:</label>
                    <input type="email" id="loginEmail" required onChange={e=>setEmail(e.target.value)}></input>
                    <div className="spacer"></div>
                    <br></br>

                    <label id='loginLabel' htmlFor="loginPassword">Password:</label>
                    <input type="password" id="loginPassword" required onChange={e=>setPassword(e.target.value)}></input>
                    <p className='text-right'><a href="/account/forgot-password" id="forgotPasswordLink" className='hover:underline'>Forgot your password?</a></p>
                    <label className="spacer"></label>
                    <br></br><br></br>

                    <button type="submit" id="loginButton">Login</button>
                    <br></br>
                    <br></br>

                    <p className='text-center'>Don't have an account? Register <a href="/account/register" id="registerLink">here!</a></p>
            </form>
        </div>
    )
}