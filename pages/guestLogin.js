import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'
import styles from "@/styles/Home.module.css";

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
        
       
            <div>
                <div style={{
                            border: '1px solid black',
                            borderRadius: '5px',
                            padding: '20px',
                            backgroundColor: '#f5f5f5',
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}>
                    <form onSubmit={handleSubmit}>
                    <h1 className={styles.title}>
                    Guest Login
                    </h1>
                    <div>
                        <label>
                        Name: <br/><input 
                            type="text" 
                            onChange={e => setName(e.target.value)}
                            disabled={status === 'submitting'}
                        />
                        </label>
                    </div>
                    <span class="brsmall"></span> 
                    <div>
                        <button className={styles.button} disabled={
                            name.length === 0 ||
                            status === 'submitting'
                        } type="submit">
                            Register
                            </button>
                    </div>
                    <span style={{color: 'red'}}>
                        {errorMsg && <p className="error">{errorMsg}</p>}
                    </span>
                    <span class="brsmall"></span> 
                    <Link href="/" className='link'>Go Back</Link>
                </form>
                </div> 
            <br />

            </div>
      
       
    );
  }