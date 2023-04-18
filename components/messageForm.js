import { useState, useContext } from 'react'
import { RoomContext } from '@/lib/roomContext'

/**
 * Displays the message submission form and handles sending messages.
 */
export default function MessageForm ({ onSubmit, prompt, disabled }) {

    const {room, user} = useContext(RoomContext);
    const [toSend, setToSend] = useState('');
    const [anonymous, setAnonymous] = useState(false);

    async function handleSubmit (e) {
        e.preventDefault();
        setToSend('');

        const message = {
            body: toSend, 
            sender: user,
            anonymous: anonymous,
            roomId: room._id,
            time: Date.now(),
            upvotes: [],
            replies: [],
            status: 'waiting'
        }

        onSubmit(message);
    };

    return (<>
        <form className='inputBox' onSubmit={(e) => {handleSubmit(e)}}>
            <input className='textBar'
                type="text"
                value={toSend}
                onChange={(e) => setToSend(e.target.value)}
                placeholder={prompt}
                disabled={disabled}
            />
            
            <label>send anonymously </label>
            <input type="checkbox" onChange={() => {
                setAnonymous(!anonymous)
            }} disabled={disabled}/>
            
            <button type="submit" disabled={disabled}>Send</button>
        </form>
        <style jsx>{`
            .inputBox {
                width: 100%;
            }

            .textBar {
                width: 100%;
            }

            label {
                vertical-align: top;
            }

            [type=checkbox] {
                width: 1em;
            }
    
            button {
                float: right;
                width: 100px;
                
            }
        `}</style>
    </>)
}