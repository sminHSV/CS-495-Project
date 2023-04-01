import { useRouter } from "next/router";
import { useState, useRef } from 'react';
import Link from 'next/link';
import styles from '/styles/Home.module.css'

export default function SignInPage() {
    const router = useRouter();
    const email = useRef();
    const password = useRef();

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: email.current.value,
                password: password.current.value
            }),
        });

        if (response.ok) {
            return router.push("/");
        } else {
            let message = (await response.json()).message;
            setErrorMsg(message);
            setStatus('typing');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
            
        }}>
            <div>
                <div style={{
                    border: '1px solid black',
                    borderRadius: '5px',
                    padding: '20px',
                    backgroundColor: '#f5f5f5'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>
                            Email: <br/><input 
                                type="text" 
                                ref={email}
                                disabled={status === 'submitting'} 
                                required
                            />
                            </label>
                        </div><br/>
                        <div>
                            <label>
                            Password: <br/><input 
                                type="password" 
                                ref={password}
                                disabled={status === 'submitting'}
                                required
                            />
                            </label>
                        </div><br/>
                        <div>
                            <button className={styles.button} disabled={
                                status === 'submitting'
                            } type="submit">
                                Sign in
                            </button>
                        </div>
                        <span style={{color: 'red'}}>
                            {errorMsg || <br/>}
                        </span>
                        <Link href="/resetPassword" className='link'>Reset Password</Link>
                        <div></div>
                        <Link href="/" className='link'>Go Back</Link>
                    </form>
                </div>
                <br />
               
               
            </div>
            {errorMsg && <p style={{color: 'red'}}>{errorMsg}</p>} 
        </div>
    );
}
