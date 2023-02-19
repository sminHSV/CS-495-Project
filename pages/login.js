import { useRouter } from "next/router";
import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            return router.push("/profile");
        } else {
            let message = (await response.json()).message;
            setErrorMsg(message);
            setStatus('typing');
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                Email: <input 
                    type="text" 
                    onChange={e => setEmail(e.target.value)} 
                    disabled={status === 'submitting'} 
                />
                </label>
            </div>
            <div>
                <label>
                Password: <input 
                    type="password" 
                    onChange={e => setPassword(e.target.value)}
                    disabled={status === 'submitting'}
                />
                </label>
            </div>
            <div>
                <button disabled={
                    email.length === 0 ||
                    password.length === 0 ||
                    status === 'submitting'
                } type="submit">Sign in</button>
            </div>
            {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <br />
        <Link href="/">Go Back</Link>
        </>
    );
}