import Link from 'next/link';
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import useUser from '@/lib/useUser'

const channels = new Pusher(process.env.NEXT_PUBLIC_KEY, {
    cluster: 'us2',
});

export default function Room({ roomId }) {
    const [messages, setMessages] = useState({});
    const [toSend, setToSend] = useState('');
    const [anonymous, setAnonymous] = useState(false);

    const {data: user} = useUser();

    const name = user ? user.name : 'guest';

    const channel = channels.subscribe(roomId);

    channel.unbind();

    channel.bind('pusher:subscription_succeeded', async () => {
        const result = await fetch("/api/messages/" + roomId);

        if (!result.ok) {
            console.log('failed to load messages');
            return;
        }

        const messages = await result.json();
        messages.forEach(message => {
            updateMessage(message);
        });
    });

    channel.bind('message-sent', function(message) {
        setMessages(messages => ({
            ...messages,
            [message._id] : message
        }));
        channel.unbind();
    });

    channel.bind('message-edit', function(message) {
        setMessages(messages => ({
            ...messages,
            [message._id] : message
        }));
        channel.unbind();
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await fetch("/api/messages/" + roomId, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                body: toSend, 
                sender: name, 
                anonymous: anonymous,
                time: Date.now(),
                upvotes: 0,
                replies: [],
            }),
        });
        if (!result.ok) {
            console.error('faied to send message');
        }
    };

    const handleUpvote = async (e, message) => {
        e.preventDefault();

        message.upvotes++;

        const result = await fetch("/api/messages/" + roomId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        });
        if (!result.ok) {
            console.error('faied to update message');
        }
    }

    function updateMessage(message) {
        setMessages(messages => ({
            ...messages,
            [message._id] : message
        }));

        console.log(messages);
    }

    return (
    <div style={{margin: '10px'}}>
       <h1>Welcome to room #{roomId}</h1>
       <Link href="/" className='link'>Leave room</Link>
       <br />
       <div className='grid'>
            <div className='terminal'>
                <ul className="queue">
                    {Object.values(messages).map(message => (
                        <li key={message._id} className='message'>
                            <p>{message.body}</p>
                            <small>Sent by {message.anonymous ? 'anonymous' : message.sender}</small>
                            <button id='reply'>reply</button>
                            <button id='upvote' onClick={e => {handleUpvote(e, message)}}>
                                {message.upvotes} &#9757;
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
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
            <div className='subTerminal'></div>
       </div>              
       <style jsx>{`
        .grid {
            display: grid;
            grid-template-columns: repeat(3, 30vw);
            gap: 10px;
            grid-template-rows: repeat(4, 20vh);
        }

        .message {
            position: relative;
            height: 60px;
            padding: 5px;
            font: 0.7em system-ui;
            border: 1px solid #eaeaea;
        }

        .message small {
            position: absolute;
            font-size: 0.8em;
            bottom: 0;
        }

        .message #reply {
            position: absolute;
            font-size: 1.1em;
            margin: 3px;
            right: 40px;
        }

        .message #upvote {
            position: absolute;
            font-size: 1.1em;
            margin: 3px;
            right: 10px;
        }

        .terminal {
            color: inherit;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            grid-column: 1 / 3;
            grid-row: 1 / 4;
            overflow: hidden;
            overflow-y: scroll;
        }

        .subTerminal {
            color: inherit;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            grid-column: 3;
            grid-row: 1 / 4;
        }

        .inputBox {
            position: relative
            color: inherit;
            border: 1px solid #eaeaea;
            border-radius: 10px;
            grid-column: 1 / 4;
            grid-row: 4;
            padding: 15px;
        }

        .inputBox .textBar {
            position: absolute;
            width: 85%;
            margin-top: 15px;
            justify-self: center;
        }

        .inputBox button {
            position: absolute;
            right: 10%;
            width: 100px;
        }
       `}</style>
       </div>
    );
}

export function getServerSideProps(context) {
    return {
        props: { 
            roomId: context.params.id, 
        }
    };
}

