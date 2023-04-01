import { useRouter } from "next/router";
import { useState } from 'react';
import Link from 'next/link';


export default function JoinRoom() {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('typing');
    const [error, setError] = useState(null);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        const res = await fetch('/api/join?name='+name, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            
          });
        console.log("%s: %s",res, res.id);
        const id = await res.json();
        return router.push('/room/' + id.id);
        if (res) {
        //FIXME: make page succseful login 
       

        } else {
            let message = (await response.json()).message;
            setErrorMsg(message);
            return router.push('/room/0');
        }
        
    };
    return (
        <>
        <form onSubmit={handleSubmit}>
        <div class="parent">
            <div class="child">
                <div style={{
                    border: '1px solid black',
                    borderRadius: '5px',
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    minWidth: '350px',
                    width: '40vh'
                }}>
            <div>
                <label>
                Enter Room Name: <input 
                    type="text" 
                    onChange={e => setName(e.target.value)} 
                    disabled={status === 'submitting'} 
                />
                </label>
            </div>
            <div>
                <button disabled={
                    name.length === 0 ||
                    status === 'submitting'
                } type="submit">Join</button>
            </div>
            <Link href="/" class ="link">Go Back</Link>
            {error && <p className="error">{error}</p>}
            </div>
            </div>
        </div>
        </form>
        <br />
        
       
        </>
      
       
    )
}