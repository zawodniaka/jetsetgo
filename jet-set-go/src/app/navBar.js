'use client'
//@refresh reset

import {supabase} from '../../supabaseClient';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NavBar(){
    const [logStatus, setLogStatus] = useState("login");
    const [isAdmin, setIsAdmin]=useState(false);
    var logElement = buildLogElement();
    var profileElement = addProfile();
    var contactElement = contactUs();
    var checkoutElement = addCheckout();
    const router = useRouter();

    //if these is a session found, we have a user
    //if we have a user they need to logout
    //if we don't have a user, they need to login
    async function checkSession() {
        const {data} = await supabase.auth.getSession();
        
        if(data.session!=null){
            setLogStatus("logout");
            await checkAdmin();
        }else{
            setLogStatus("login");           
        }
    }

    async function checkAdmin(){
      if(logStatus=='logout'){
        const {data} = (await supabase.auth.getUser());
        const uId=data.user.id;
        const {data:adminStatus} = await supabase.from('users').select('admin').eq('user_id', uId);

        if(adminStatus.at(0).admin){
          setIsAdmin(true);
        }else{
          setIsAdmin(false);
        }
      }else{
        setIsAdmin(false);
      }
    }

    function addCheckout(){
      if(logStatus === 'logout' && !isAdmin){
        return <li className="navElement"><Link href="/checkout">Checkout</Link></li>;
      }
    }

    //signs the user out and reloads the page(to update the element) and redirects to /welcome
    //otherwise alerts with an error
    async function signOut(){
        const {error}= await supabase.auth.signOut();
        if(error){
            alert(error);
        }else{
            setIsAdmin(false);
            window.location.href = '/account/login';
        }  
    }

    //Redirects users to their profile page
    async function profile() {
      window.location.href = '/users/profile';
    }

    //holds 3 different elements for the navbar
    //if the status is 'logout' then create an element that allows logout
    //if the status is 'login' then create an element that goes to sign in page
    //otherwise create an element that shows 'waiting...' (in case of errors or async problems)
    function buildLogElement() {
        checkSession();
      if(logStatus=='logout'){
        return <li className="navElement" onClick={signOut}>Logout</li>;
      }else if(logStatus=='login'){
        return <li className="navElement"><Link href="/account/login">Login</Link></li>;
      }else{
        return <li className="navElement">waiting...</li>;
      }
    }

    //Updates logo's address depending on log in and admin status
    function buildHomeElement(){
      checkSession();
      if(logStatus=='logout'){
        if(isAdmin){
          return '/admin';
        }
        return '/users';
      }else{
        return '/';
      }
    }

    //Adds "User Profile" to Navbar. Separate from buildLogElement() due to styling errors
    function addProfile() {
      checkSession();
      if(logStatus=='logout') {
        return <li className='navElement'><Link href="/users/profile">User Profile</Link></li>
      } else if (logStatus != 'login') {
        return <li className="navElement">waiting...</li>; //Added incase of errors
      }
    }

    function contactUs(){
        if(!isAdmin){
          return <li className="navElement"><Link href="/contact">Contact Us</Link></li>;
        }
    }

    
    function addCheckout(){
      if(logStatus === 'logout' && !isAdmin){
        return <li className="navElement"><Link href="/checkout">Checkout</Link></li>;
      }
    }

    return(
        <nav id="navbar" className="flex justify-between items-center px-8 py-1 bg-blue-700 bg-opacity-90">
          {/* Left side logo */}
          <Link href={buildHomeElement()} className="flex items-center navLogo">
            <img src="/JETSETGO Logo.png" alt="Airplane Logo" className="h-30 w-30 mr-3" />
          </Link>
        
          <ul id="navbar" className="flex space-x-8">
            
              {contactElement}
              {checkoutElement}
              {profileElement}
              {logElement}
                    
          </ul>
        </nav>
    );
}