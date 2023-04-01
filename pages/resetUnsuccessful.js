import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function ResetUnSuccessful(){
    const router = useRouter();

    return(
        <>
        <div>
            <h2>Something went wrong when trying to reset your password. Please try again later</h2>
        </div>
        <br />
        <Link href="/login" className='link'>Login</Link>
        </>
    );
}