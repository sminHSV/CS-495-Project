import { useRouter } from 'next/router';
import {useState } from 'react';
import Link from 'next/link'
import httpStatus from 'http-status';
 
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
            if(response.status == httpStatus.NOT_FOUND){
                return router.push('/resetEmailNotFound');
            }
              let message = (await response.json()).message;
              setErrorMsg(message);
              setStatus('typing');
              return router.push('/resetEmailUnsuccessful');
          }
    };

    return(
        <>
        <form onSubmit={handleSubmit}>
         <div>
            <p>Please enter your email to reset your password</p>
        </div>
        <div>
            <label>
            Email: <input 
                type="text" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'submitting'}
            />
            </label>
        </div>
        <div>
            <button disabled={
                email.length === 0 ||
                status === 'submitting'
            } type="submit">Reset Password</button>
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        </form>
        <br />
        <Link href="/login" className='link'>Go Back</Link>
        </>
    );
}