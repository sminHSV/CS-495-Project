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
        
        <div className= "parent">
            <div className="child">
                <div style={{
                            border: '1px solid black',
                            borderRadius: '5px',
                            padding: '20px',
                            backgroundColor: '#f5f5f5',
                            width: '225px'
                        }}>
                    <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                        Name: <br/><input 
                            type="text" 
                            onChange={e => setName(e.target.value)}
                            disabled={status === 'submitting'}
                        />
                        </label>
                    </div><br/>
                    <div>
                        <button disabled={
                            name.length === 0 ||
                            status === 'submitting'
                        } type="submit">Register</button>
                    </div>
                    <span style={{color: 'red'}}>
                        {errorMsg && <p className="error">{errorMsg}</p>}
                    </span>
                    <Link href="/" className='link'>Go Back</Link>
                </form>
                </div> 
            <br />

            </div>
        </div> 
       
    );
  }