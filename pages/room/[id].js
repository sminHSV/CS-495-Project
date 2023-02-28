import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePusher } from '@/lib/PusherContext';
import useUser from '@/lib/useUser'

export default function Room({ roomId }) {
    const [messages, setMessages] = useState({});
    const [toSend, setToSend] = useState('');
    const [anonymous, setAnonymous] = useState(false);

    const {data: user} = useUser();
    const channels = usePusher();

    useEffect(() => {
        const channel = channels.subscribe(roomId);

        channel.bind('pusher:subscription_succeeded', async () => {
            const result = await fetch("/api/messages/" + roomId);

            if (!result.ok) {
                console.log('failed to load messages');
                return;
            }

            const messages = await result.json();

            console.log(messages);

            messages.forEach(message => updateMessage(message));
        });

        channel.bind('message-update', function(message) {
            updateMessage(message);
        });
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        setToSend('');

        const result = await fetch("/api/messages/" + roomId, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                body: toSend, 
                sender: user,
                anonymous: anonymous,
                time: Date.now(),
                upvotes: [],
                replies: [],
            }),
        });
        if (!result.ok) {
            console.error('faied to send message');
        }
    };

    const handleUpvote = async (e, message) => {
        e.preventDefault();

        e.target.disabled = true;

        const result = await fetch("/api/messages/" + roomId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...message, 
                upvotes: [...message.upvotes, user._id] 
            }),
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
    }

    return (
    <div style={{margin: '10px'}}>
       <h1>Welcome to room #{roomId}</h1>
       <Link href="/" className='link'>Leave room</Link>
       <br /><br />
       <div className='grid'>
            <div className='terminal'>
                <ul>
                    {Object.values(messages)
                        .sort((a, b) => (Number(a._id) - Number(b._id)))
                        .map(message => (
                            <li key={message._id}>
                                <div className='message'>
                                    <div>
                                        <button id='reply'>reply</button>
                                        <button id='upvote' 
                                            onClick={e => {handleUpvote(e, message)}}
                                            disabled={message.upvotes.find(id => id === user._id)}
                                        >
                                            {message.upvotes.length} &#9757;
                                        </button>
                                        <p>{message.body}</p>
                                        <small>
                                            Sent by {
                                                message.anonymous ? 'anonymous' : message.sender?.name
                                            } at {
                                                new Date(message.time).toLocaleTimeString()
                                            }
                                        </small>
                                    </div>
                                    <details>
                                        <summary>{message.replies.length} replies</summary>
                                    </details>
                                </div>
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
            padding: 5px;
            min-height: 60px;
            font: 1.5em system-ui;
            border: 1px solid #eaeaea;
            inline-size: 100% - 80px;
            overflow-wrap: break-word;
            line-height: 20px;
            border-radius: 5px;
            display: grid;
            grid-template-rows: 1fr auto;
            gap: 5px;
        }

        .message > details > summary {
            display: flex;
            justify-content: center;
            font-size: 0.5em;
            list-style: none;
            cursor: pointer;
            background-color: dimgray;
        }

        .message > details > summary:hover {
            background-color: gray;
            text-decoration: underline;
        }

        .message p{
            margin-right: 90px;
            margin-bottom: 20px;
        }

        .message small {
            font-size: 0.5em;
        }

        .message #reply {
            position: absolute;
            font-size: 0.7em;
            margin: 3px;
            right: 45px;
        }

        .message #upvote {
            position: absolute;
            font-size: 0.6em;
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

        .terminal ul {
            margin: 5px;
            display: grid;
            gap: 5px;
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

