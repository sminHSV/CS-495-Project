import { useRouter } from "next/router";
import { useState } from 'react';
import Link from 'next/link';
import LoginBtn from "@/components/login-btn";

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
            {error && <p className="error">{error}</p>}
        </form>
        <br />
        <Link href="/">Go Back</Link>
        </>
    )
}