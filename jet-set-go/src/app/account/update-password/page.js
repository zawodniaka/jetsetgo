'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Check for expired or invalid links
    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('error_code=otp_expired')) {
            setError('This reset link has expired. Please request a new one.');
        }
    }, []);

    // Check for active session (Supabase logs user in via magic link)
    useEffect(() => {
        const verifySession = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData?.session) {
                setError('No active session. Please use the reset link from your email again.');
            }
        };
        verifySession();
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setError('Error updating password: ' + error.message);
        } else {
            setConfirmed(true);
            setTimeout(() => {
                router.push('/account/login');
            }, 2000);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
            <form 
                onSubmit={handleUpdatePassword}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    fontFamily: 'sans-serif',
                    color: 'black'
                }}>

                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Reset Your Password</h2>

                {confirmed ? (
                    <p style={{ color: 'green' }}>Password updated! Redirecting to login...</p>
                ) : (
                    <>
                        <label>New Password:</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="submit"
                            style={{
                                marginTop: '20px',
                                width: '100%',
                                padding: '10px',
                                backgroundColor: 'darkBlue',
                                color: 'white',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>
                            Update Password
                        </button>
                    </>
                )}

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
