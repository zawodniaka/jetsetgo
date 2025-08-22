'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';

export default function ProfilePage() {

    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    //const [menuOpen, setMenuOpen] = useState(false); 

    const [userId, setUserId] = useState(null);
    //const [userData, setUserData] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setAdmin] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');


    const getUserCredentials = async () => {


        let { data: sessionData } = await supabase.auth.getSession();

  
        // If there is no session, redirect to welcome page
        if (!sessionData?.session) {
            router.push('/account/login'); // We can change this path
            return;
        }

        const uid = sessionData.session.user.id;
        setUserId(uid);

        await loadProfile(uid);
        
    };

        const loadProfile = async (uid) => {
            const { data, error } = await supabase
                .from('users')
                .select('first_name, last_name, username, admin')
                .eq('user_id', uid)
                .single();

            if (error) {
                console.error('Failed to fetch profile:', error.message);
                return;
            }

            // Pulling email from the auth.users session
            const { data: sessionData } = await supabase.auth.getSession();
            setEmail(sessionData.session.user.email);

            console.log('Loaded profile:', data);
            setFirstName(data.first_name);
            setLastName(data.last_name);
            //setEmail(data.email);
            setUsername(data.username);
            setAdmin(data.admin);

        };

        const handleSave = async () => {

            if (!firstName.trim() || !lastName.trim() || !email.trim()) {
                setErrorMessage('All fields are required and cannot be left blank.');
                return;
            }

            setErrorMessage(''); // Clear any previous error


            const { data: userData, error: userError } = await supabase.auth.getUser();

            // Update email in the auth.users table
            const { error: authError } = await supabase.auth.updateUser({
                email: email
            });

            if (authError) {
                console.error('Failed to update auth email:', authError.message);
                setErrorMessage('Failed to update email.');
                return;
            } 

            // Update name in 'users' table
            const { data, error } = await supabase
                .from('users')
                .update({
                    first_name: firstName,
                    last_name: lastName,
                    email: email
                })
                .eq('user_id', userId)
                .select();
        
            if (error) {
                console.error('Update failed:', error.message);
                setErrorMessage('Update failed. Please try again.');

            } else if (!data || data.length === 0) {
                console.warn('Update blocked - possibly email-related or RLS issue');
                setErrorMessage('Update blocked. Please check your input.');

            } else {
                console.log('Update successful', data);
                setEditMode(false);
                router.refresh();
        }
    
    };

    useEffect(() => {
        getUserCredentials();

    }, []);

    const buttonStyle = {
        marginTop: '20px',
        width: '100%',
        padding: '10px',
        backgroundColor: 'darkBlue',
        color: 'white',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer'
    };

    const linkStyle = {
            textDecoration: 'none',
            color: '#222',
            padding: '8px 5px',
            fontSize: '16px'
    };

    return (

        <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            fontFamily: 'sans-serif'
         }}>
            
            {!isAdmin ? (  
                <div>
                {/* Profile Nav Bar */} 
                    <div style={{
                        position: 'fixed',
                        top: '150px',
                        right: '20px',
                        zIndex: 1000,
                        width: '240px',
                        color: 'black',
                        backgroundColor: 'white',
                        padding: '15px',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)'
                    }}>

                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ fontWeight: 'bold' }}>Username: {username}</div>
                        </div>    
                    
                        {/* Links sections in the dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <a href="/users/profile" style={linkStyle}>👤 Profile</a>
                            <a href="/users/my-trips" style={linkStyle}>🧳 My Trips</a>
                        </div>
                    </div>
                </div>
            ) : ""}

            {/*Main Profile Content*/}
            <div style={{ 
                flexGrow: 1, 
                display: 'flex', 
                justifyContent: 'center', 
                paddingTop: '100px', 
                paddingBottom: '60px',
                alignItems: 'flex-start' 
            }}>
        
                <form 
                    style= {{
                        color: 'black',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        maxWidth: '400px',
                        fontFamily: 'sans-serif'
                    }}>

                    <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>
                        Your Profile
                    </h2>

                    <label htmlFor="firstName">First Name: </label>
                    {editMode ? (
                        <input id="firstName" name="firstName" type="text" value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}/>
                    ) : (
                        <strong> {firstName} </strong>

                    )}
                    <br/>

                    <label htmlFor="lastName">Last Name: </label>
                    {editMode ? (
                        <input id="lastName" name="lastName" type="text" value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}/>
                    ) : (
                        <strong> {lastName} </strong>

                    )}
                    <br/>

                    <label htmlFor="email">Email: </label>
                    {editMode ? (
                        <input id="email" name="email" type="email" value={email} 
                            onChange={(e) => setEmail(e.target.value)}/>
                    ) : (
                        <strong> {email} </strong>

                    )}
                    <br/>

                    {errorMessage && (
                        <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
                            {errorMessage}
                        </p>
                    )}

                    {editMode ? (
                        <button type="button" className='buttonStyle' onClick={handleSave}>
                            Save
                        </button>
                    ) : (
                        <button type="button" className='buttonStyle' onClick={() => setEditMode(true)}>
                            Edit Your Profile
                        </button>
                    )}
                </form>
            </div>
        </div>
    );

}












