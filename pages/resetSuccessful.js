import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'
import styles from "@/styles/Home.module.css";

export default function ResetSuccessful(){
    const router = useRouter();

    return(
        <div>
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
                Your Password has been successfully reset!
                    </h1>                
            
                
                <div className='linkCenter'>       
                <Link href="/login" className='link'>Login</Link>
                </div> 
            </div>
        </div>
    );
}