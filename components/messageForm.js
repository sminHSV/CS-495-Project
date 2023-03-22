import { useState, useContext } from 'react'
import { RoomContext } from '@/lib/roomContext'

/**
 * Displays the message submission form and handles sending messages.
 */
export default function MessageForm () {

    const {roomId, user} = useContext(RoomContext);
    const [toSend, setToSend] = useState('');
    const [anonymous, setAnonymous] = useState(false);

    async function handleSubmit (e) {
        e.preventDefault();
        setToSend('');

        const result = await fetch("/api/messages?" + new URLSearchParams({ roomId }), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                body: toSend, 
                sender: user,
                anonymous: anonymous,
                time: Date.now(),
                upvotes: [],
                replies: [],
                status: 'waiting'
            }),
        });

        if (!result.ok) console.error('failed to send message');
    };

    return (<>
        <form className='inputBox' onSubmit={(e) => {handleSubmit(e)}}>
            <input className='textBar'
                type="text"
                value={toSend}
                onChange={(e) => setToSend(e.target.value)}
                placeholder="ask a question..."
            />
            <br /><br /><br />
            <label> Ask anonymously </label>
            <input type="checkbox" onChange={() => {
                setAnonymous(!anonymous)
            }}/>
            
            <button type="submit">Send</button>
        </form>
        <style jsx>{`
            .textBar {
                position: absolute;
                width: 85%;
                margin-top: 15px;
                justify-self: center;
            }
    
            button {
                position: absolute;
                right: 10%;
                width: 100px;
            }
        `}</style>
    </>)
}