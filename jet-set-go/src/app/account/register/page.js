'use client';

import { useState } from 'react';
import { supabase } from '../../../../supabaseClient';

export default function RegisterPage() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function that connects to Supabase when the user submits the form
    const handleSubmit = async (e) => {

        e.preventDefault();
        setError('');
        setSuccess('');

        // First, sign up the user in the auth database
        const {data: authData, error:signupError } = await supabase.auth.signUp({
            email:email, 
            password:password
        });

        //if theres an error it will be displayed
        if(signupError){
            console.error('Auth signup error:', signupError);
            setError("There was a problem signing up: " + signupError.message);
            return;
        }

        // Get the new user ID
        const userId = authData.user?.id;

        if (!userId) {
            setError('Failed to get user ID after signing up.');
            return;
        }

        // Checking for existing users
        /*const { data: existingUsers, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq."${email}",username.eq."${username}"`);

        if (fetchError) {
            console.error(fetchError);
            setError('There was a problem checking existing users.');
            return;
        }    

        if (existingUsers.length > 0) {
            setError('Username or email already exists.');
            return;
        }*/

        // Insert new user
        const { data, error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    user_id: userId, //Foreign key from auth table
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    email: email,
                    password: password //right now is plain text, we might want to hash this for extra security
                }
            ]);

            if (insertError) {
                console.error(insertError);

                // 23505 is a PostgreSQL unique violation error
                if (insertError.code === '23505') {
                    setError('Username or email already exists.');
                } else { 
                    //setError('There was a problem creating your account.');
                    setError('Username or email already exists.');
                }
                return;
            }

            // If successful, it shows a success message and clears the input fields
            setSuccess('Account created succesfully!'); // We could redirect the user
            setFirstName('');
            setLastName('');
            setUsername('');
            setEmail('');
            setPassword('');

            window.location.href = '/account/login'; //Redirects user to the login page. We can update this later to redirect to user hom epage and have them logged in.
        };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px', paddingBottom: '60px' }}>

            <form 
                onSubmit={handleSubmit}
                style= {{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '400px',
                    fontfamily: 'sans-serif',
                    color: 'black',
                }}>

                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Create Your Account</h2>

                <label>First Name: </label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required 
                    style={inputStyle} />
                <br/>

                <label>Last Name: </label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required 
                    style={inputStyle} />
                <br/>

                <label>Username: </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                    style={inputStyle} />
                <br/>

                <label>Password: </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    style={inputStyle} />
                <br/>

                <label>Email: </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    style={inputStyle} />
                <br/>

                <button className='buttonStyle' type="submit">Create Account</button>
                <p className='text-center mt-4 mb-2'>Have an account? Login <a href="/account/login" id="registerLink">here!</a></p>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

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