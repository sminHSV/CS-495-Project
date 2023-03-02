import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function ResetUnsuccessful(){
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');
    return(
        <>
        <div>
            <p>Something went wrong with sending your password reset email. Please try again later</p>
        </div>
        <br />
        <Link href="/login" className='link'>Login</Link>
        </>
    );
}