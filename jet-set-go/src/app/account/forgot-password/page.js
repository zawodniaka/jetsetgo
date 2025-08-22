'use client';

import { useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const router = useRouter('');
    

    const handleResetPassword = async (e) => {

        e.preventDefault();
        setMessage('');
        setError('');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/account/update-password', 
        });

        if(error){
            setError("Error: " + error.message);
            //return;
        } else {
            setMessage('Check your email for the reset link.');
            router.push('/account/check-email');
        }

    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px', paddingBottom: '60px' }}>

            <form onSubmit={handleResetPassword}
                style= {{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    fontFamily: 'sans-serif',
                    color: 'black',
                }}>

            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>
                Forgot Your Password?
            </h1>

            
            <label>Enter your email:</label><br/>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                    />

                <button className='buttonStyle' type="submit">Send Reset Link</button>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                
            </form>
            
        </div>

    );

}

const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
};