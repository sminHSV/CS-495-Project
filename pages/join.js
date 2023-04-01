import { useRouter } from "next/router";
import { useState } from 'react';
import Link from 'next/link';


export default function JoinRoom() {
    const [id, setId] = useState('');
    const [status, setStatus] = useState('typing');
    const [error, setError] = useState(null);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        router.push('/room/' + id);
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
                Enter Room Id: <input 
                    type="text" 
                    onChange={e => setId(e.target.value)} 
                    disabled={status === 'submitting'} 
                />
                </label>
            </div>
            <div>
                <button disabled={
                    id.length === 0 ||
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