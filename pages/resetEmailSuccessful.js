import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'
import styles from "@/styles/Home.module.css";


export default function ResetEmailSuccessful(){
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
            Reset Password E-mail Sent
            </h1>
            <p>An E-mail has been sent for you to reset your password. <br/>Please click the link in the email to reset your password</p>
            <br />
            <div className='linkCenter'>
            <Link href="/login" className='link'>Login</Link>
            </div>
            
        </div>
        

    );
}