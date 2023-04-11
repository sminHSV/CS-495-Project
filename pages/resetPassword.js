import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'
import styles from "@/styles/Home.module.css";

 


export default function ResetPassword(){
    const router = useRouter();
    const [email, setEmail] = useState('');

    const [errorMsg, setErrorMsg] = useState(null);
    const [status, setStatus] = useState('typing');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
    
          const response = await fetch('/api/resetPassword?email='+email, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            
          });
  
          if (response.ok) {
            //FIXME: make page succseful login 
            return router.push('/resetEmailSuccessful');

          } else {
              let message = (await response.json()).message;
              setErrorMsg(message);
              setStatus('typing');
              return router.push('/resetEmailUnsuccesful');
          }
    };

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
            <form onSubmit={handleSubmit}>
            <h1 className={styles.title}>
                    Password Reset
            </h1>
            {/* <p>Please enter your email to reset your password</p> */}
      
        <div>
            <label>
            Email: <br/><input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'submitting'}
            />
            </label>
        </div>
        <span class="brsmall"></span>
        <div>
            <button className={styles.button} disabled={
                email.length === 0 ||
                status === 'submitting'
            } type="submit">Reset Password</button>
        </div>
        <span style={{color: 'red'}}>
        {errorMsg && <p className="error">{errorMsg}</p>}
        </span>
    
        <br />
        <span class="brsmall"></span> 
        <Link href="/login" className='link'>Go Back</Link>
      </form>
      </div>
      </div>
    );
}