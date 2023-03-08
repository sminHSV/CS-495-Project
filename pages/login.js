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
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
            
        }}>
            <div>
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
                </form>
                <br />
                <Link href="/register" className='link'>Register an account</Link>
                <br /><br />
                <Link href="/guestLogin" className='link'>Sign in as a guest</Link>
                <br /><br />
                <Link href="/" className='link'>Go Back</Link>
            </div>
        </div>
    );
}