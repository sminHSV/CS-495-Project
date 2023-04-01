import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function ResetEmailSuccessful(){
    const router = useRouter();

    return(
        <>
        <div>
            <h2>An Email has been sent for you to reset your password</h2>
            <p>Please click the link in the email to reset your password</p>
        </div>
        <br />
        <Link href="/login" className='link'>Login</Link>
        </>
    );
}