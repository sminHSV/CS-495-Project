import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'

export default function ResetUnSuccessful(){
    const router = useRouter();

    return(
        <div style={{
            border: '1px solid black',
            borderRadius: '5px',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
        <h1 className={styles.title}>
        Something went wrong when trying to reset your password. Please try again later.
        </h1>
        <div className='linkCenter'>
        <Link href="/login" className='link'>Login</Link>
        </div>
        
        </div>
    );
}


