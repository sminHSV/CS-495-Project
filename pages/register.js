import { useRouter } from 'next/router';
import {useRef, useState } from 'react';
import Link from 'next/link'
import httpStatus from 'http-status';

export default function Register() {
    const router = useRouter();

    const email = useRef();
    const name = useRef();
    const password1 = useRef();
    const password2 = useRef();

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        if (password1.current.value !== password2.current.value) {
            setErrorMsg('Passwords don\'t match.');
            setStatus('typing');
            return;
        }
  
        const response = await fetch('/api/register', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email.current.value, 
                password: password1.current.value, 
                name: name.current.value
            }),
        });

        if (response.status === httpStatus.CREATED) {
            return router.push('/login');
        } else {
            let message = (await response.json()).message;
            setErrorMsg(message);
            setStatus('typing');
        }
    };

    return (

            <div class ="parent">
                <div class ="child">
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
                    Name: <br/><input 
                        type="text" 
                        ref={name}
                        disabled={status === 'submitting'}
                        required
                    />
                    </label>
                </div><br/>
                <div>
                    <label>
                    Password: <br/><input 
                        type="password" 
                        ref={password1}
                        disabled={status === 'submitting'}
                        required 
                    />
                    </label>
                </div><br/>
                <div>
                    <label>
                    Confirm Password: <br/><input 
                        type="password" 
                        ref={password2}
                        disabled={status === 'submitting'}
                        required
                    />
                    </label>
                </div>
                <br/>
                <div>
                    <button 
                        disabled={status === 'submitting'} 
                        type="submit">
                        Register
                    </button>
                </div>
                <span style={{color: 'red'}}>
                    {errorMsg || <br/>}
                </span>
                </form>
                <br />
                <Link href="/">Go Back</Link>
            </div>
       </div>
    );
  }