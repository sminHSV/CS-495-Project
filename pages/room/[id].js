import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePusher } from '@/lib/PusherContext'
import useUser from '@/lib/useUser'
import useSWR from 'swr'

const fetchJSON = (...args) => fetch(...args).then(res => res.json());
const fetchText = (...args) => fetch(...args).then(res => res.text());

export default function Room({ roomId }) {
    const [messages, setMessages] = useState(null);
    const [toSend, setToSend] = useState('');
    const [anonymous, setAnonymous] = useState(false);

    const { user } = useUser();
    const channels = usePusher();

    const { data: room, error } = useSWR('/api/room?' + new URLSearchParams({ roomId }), fetchJSON);
    const { data: dailyCode } = useSWR('/api/dailyCode?' + new URLSearchParams({ roomId }), fetchText);

    useEffect(() => {
        const channel = channels.subscribe(Buffer.from(roomId, 'base64').toString('hex'));

        channel.bind('message-update', function(message) {
            updateMessage(message);
        });

        (async () => {
            const result = await fetch("/api/messages?" + new URLSearchParams({ roomId }));

            if (!result.ok) {
                console.log('failed to load messages');
                return;
            }
            const messages = await result.json();
            setMessages({});
            messages.forEach(message => updateMessage(message));
        })();
    }, [channels, roomId]);
    
    const handleSubmit = async (e) => {
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
            }),
        });
        if (!result.ok) {
            console.error('faied to send message');
        }
    };

    const handleUpvote = async (e, message) => {
        e.preventDefault();

        e.target.disabled = true;

        const result = await fetch("/api/messages?" + new URLSearchParams({ roomId }), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...message, 
                upvotes: [...message.upvotes, user.email] 
            }),
        });
        if (!result.ok) {
            console.error('failed to update message');
        }
    }

    function updateMessage(message) {
        setMessages(messages => ({
            ...messages,
            [message._id] : message
        }));
    }

    if (error) {
        return <p>Couldn&apos;t load room</p>
    }

    if (!room) {
        return <p>Loading room...</p>
    }

    return (
    <div style={{margin: '10px'}}>
       <h1>Welcome to {room.name}</h1>
       <Link href="/" className='link'>Leave room</Link>
       <br /><br />
       <div className='grid'>
            <div className='terminal'>
                {!messages ? <><br />Loading messages...</> :
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
                                            disabled={message.upvotes.find(email => email === user.email)}
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
                </ul>}
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
            <div className='subTerminal'>
                <h2>Attendance Code: 
                    &nbsp;<p>{dailyCode || 'getting code...'}</p> 
                </h2>
            </div>
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
            overflow-wrap: anywhere;
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
            line-height: 25px;
            margin-bottom: 10px;
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

        .terminal > ul {
            margin: 10px;
        }

        .terminal > ul > li {
            margin: 10px 0;
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

