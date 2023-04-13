import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link';
import bcrypt from 'bcryptjs';
import styles from "@/styles/Home.module.css";

export default function Reset_Password(){
    const router = useRouter();
    const [newPassword, setPassword] = useState('');

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');
    const {token} = router.query;
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        let password =  await bcrypt.hash(newPassword.toLowerCase(), 10);
          const response = await fetch('/api/resetPassword', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({token, password}),
        });

        if (response.ok) {
            return router.push('/resetSuccessful');
        }
        else {
            let message = (await response.json()).message;
            setErrorMsg(message);
            setStatus('typing');
            return router.push('/resetUnsuccessful');
        }
    };

    return(
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
                    Please Enter New Password
            </h1>
        <div>
            <label>
            New Password: <br/><input 
                type="text" 
                value={newPassword}
                onChange={e => setPassword(e.target.value)}
                disabled={status === 'submitting'}
            />
            </label>
        </div>
        <span class="brsmall"></span>
        <div>
            <button className={styles.button} disabled={
                newPassword.length === 0 ||
                status === 'submitting'
            } type="submit">Set New Password</button>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <br />
        </div>
        </div>
    );
}