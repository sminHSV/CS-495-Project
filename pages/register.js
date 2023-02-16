import { useRouter } from 'next/router';
import {useState } from 'react';
import { useRef } from 'react';
import Link from 'next/link'

export default function Register() {
    const router = useRouter();
    const emailInput = useRef();
    const nameInput = useRef();
    const passwordInput = useRef();

    const [errorMsg, setErrorMsg] = useState();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = emailInput.current.value;
      const password = passwordInput.current.value;
      const name = nameInput.current.value;
  
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
            return router.push('/login');
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
            Name: <input type="text" ref={nameInput} />
            </label>
        </div>
        <div>
            <label>
            Password: <input type="password" ref={passwordInput} />
            </label>
        </div>
        <div>
            <button type="submit">Register</button>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <br />
        <Link href="/">Go Back</Link>
        </>
    );
  }