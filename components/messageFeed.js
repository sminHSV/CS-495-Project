import { useEffect, useState, useContext } from 'react'
import { usePusher } from '@/lib/PusherContext'
import { fetchJSON } from '@/lib/fetch'
import { RoomContext } from '@/lib/roomContext'

export default function MessageFeed() {

    const {roomId, user} = useContext(RoomContext);
    const [messages, setMessages] = useState(null);
    const channels = usePusher();

    function updateMessage(message) {
        setMessages(messages => ({
            ...messages,
            [message._id] : message
        }));
    }

    useEffect(() => {
        const channel = channels.subscribe(Buffer.from(roomId, 'base64').toString('hex'));

        channel.bind('message-update', function(message) {
            updateMessage(message);
        });

        setMessages({});
        
        fetchJSON("/api/messages?" + new URLSearchParams({ roomId }))
            .then(messages => messages.forEach(message => updateMessage(message)));

    }, [channels, roomId]);

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

    return (<>
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
        <style jsx>{`
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
        `}</style>
    </>)
}