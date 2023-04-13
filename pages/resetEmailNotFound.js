import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function ResetEmailUnsuccessful(){
    const router = useRouter();

    return(
        <>
        <div>
            <p>No user with that email exists. Please try with a different email or create an account</p>
        </div>
        <br />
        <Link href="/login" className='link'>Login</Link>
        <br/>
        <Link href="/regsiter" className='link'>Create Account</Link>
        </>
    );
}