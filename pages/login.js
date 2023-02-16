import { useRouter } from "next/router";
import { useRef } from 'react';
import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
    const router = useRouter();
    const emailInput = useRef();
    const passwordInput = useRef();

    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = emailInput.current.value;
        const password = passwordInput.current.value;

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
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit}>
        <div>
            <label>
            Email: <input type="text" ref={emailInput} />
            </label>
        </div>
        <div>
            <label>
            Password: <input type="password" ref={passwordInput} />
            </label>
        </div>
        <div>
            <button type="submit">Sign in</button>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <br />
        <Link href="/">Go Back</Link>
        </>
    );
}