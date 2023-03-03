import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function ResetEmailUnsuccessful(){
    const router = useRouter();

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