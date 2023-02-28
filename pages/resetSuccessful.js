import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function ResetSuccessful(){
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');
    return(
        <>
        <div>
            <h2>An Email has been sent for you to reset your password</h2>
            <p>More words</p>
        </div>
        <br />
        <Link href="/login" className='link'>Login</Link>
        </>
    );
}