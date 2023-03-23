import { useEffect, useState, useContext, useRef } from 'react'
import { RoomContext } from '@/lib/roomContext'

/**
 * Handles displaying messages and message interactions
 */
export default function Message({ message }) {

    const {room, user} = useContext(RoomContext);

    const handleUpvote = async (e) => {
        e.preventDefault();
        e.target.disabled = true;

        const result = await fetch("/api/messages?" + new URLSearchParams({ roomId: room._id }), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...message, 
                upvotes: [...message.upvotes, user.email] 
            }),
        });

        if (!result.ok) console.error('failed to update message');
    }

    const handleStatus = async (e) => {
        e.preventDefault();

        const result = await fetch("/api/messages?" + new URLSearchParams({ roomId: room._id }), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...message, 
                status: e.target.value 
            }),
        });

        if (!result.ok) console.error('failed to update message');
    }

    return (<>
        <div className='message'>
            <div className='status'>
                {
                    message.status === 'waiting' && <span>&#10067;</span> ||
                    message.status === 'answered' && <span>&#9989;</span> ||
                    message.status === 'urgent' && <span>&#10071;</span>
                }
            </div>

            <div><p>{message.body}</p></div>

            <div className='actions'>
                <button 
                    onClick={e => {handleUpvote(e, message)}}
                    disabled={message.upvotes.find(email => email === user.email)}
                >
                    {message.upvotes.length} &#9757;
                </button>
            </div>

            <select 
                onInput={handleStatus} 
                value={message.status}
                disabled={user.email != room.owner 
                    && user.email != message.sender.email}
            >
                <option value='waiting'>waiting</option>
                <option value='urgent'>urgent</option>
                <option value='answered'>answered</option>
            </select>

            <small>
                Sent by {
                    message.anonymous ? 'anonymous' : message.sender?.name
                } at {
                    new Date(message.time).toLocaleTimeString()
                }
            </small>
            
            <details className='replies'>
                <summary>{message.replies.length} replies</summary>
            </details>
        </div>
        <style jsx>{`
            .message {
                position: relative;
                padding: 5px;
                min-height: 10lvh;
                border: 1px solid #eaeaea;
                font: 1.5em system-ui;
                border-radius: 5px;
                display: grid;
                grid-template-columns: 8lvh auto 6lvh;
                gap: 5px;
            }

            select {
                font-size: 0.5em;
                display: flex;
                grid-column: 1;
            }

            .status {  
                grid-column: 1;
                grid-row: 1 / 3;
                text-align: center;
            }

            .status > span {
                font-size: 1.4em;
            }

            p {
                overflow-wrap: anywhere;
                grid-column: 2;
                margin-left: 2lvh;
            }

            small {
                grid-column: 2 / 4;
                margin-left: 2lvh;
            }

            details {
                grid-column: 1 / 4;
            }

            summary {
                display: flex;
                justify-content: center;
                font-size: 0.5em;
                list-style: none;
                cursor: pointer;
                background-color: dimgray;
            }

            summary:hover {
                background-color: gray;
            }

            small {
                font-size: 0.5em;
            }

            .actions {
                display: flex;
                justify-content: right;
                padding: 5px;
            }

            .actions > button {
                height: 3lvh;
                font-size: 0.7em;
            }
        `}</style>
    </>)
}