import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function Reset_Password(){
    const router = useRouter();
    const [email, setPassword] = useState('');

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
    
          const response = await fetch('/api/resetPassword', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            
        });

        if (response.ok) {
            return router.push('/resetSuccesful');
        }
        else {
            let message = (await response.json()).message;
            setErrorMsg(message);
            setStatus('typing');
            return router.push('/resetUnsuccesful');
        }
    };

    return(
        <>
        <form onSubmit={handleSubmit}>
         <div>
            <p>Please enter your email to reset your password</p>
        </div>
        <div>
            <label>
            New Passowrd: <input 
                type="text" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={status === 'submitting'}
            />
            </label>
        </div>
        <div>
            <button disabled={
                email.length === 0 ||
                status === 'submitting'
            } type="submit">Set New Password</button>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <br />
        </>
    );
}