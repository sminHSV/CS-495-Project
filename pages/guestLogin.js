import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function Register() {
    const router = useRouter();

    const [name, setName] = useState('');

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        const response = await fetch("/api/guestLogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        router.push('/');
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
        <div className= "parent">
        <div className="child">
            <label>
            Name: <input 
                type="text" 
                onChange={e => setName(e.target.value)}
                disabled={status === 'submitting'}
            />
            </label>
       
        <div>
            <button disabled={
                name.length === 0 ||
                status === 'submitting'
            } type="submit">Register</button>
        </div>
        </div>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <br />
        <div className="parent">
        <div className="child">
        <Link href="/">Go Back</Link>
        </div>
        </div>
        </>
       
    );
  }