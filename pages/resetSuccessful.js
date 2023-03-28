import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function ResetSuccessful(){
    const router = useRouter();

    return(
        <>
        <div>
            <h2>Your Password has been successfully reset!</h2>
        </div>
        <br />
        <Link href="/login" className='link'>Login</Link>
        </>
    );
}