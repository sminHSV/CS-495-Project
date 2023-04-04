import { useEffect, useState, useContext, useRef } from 'react'
import { RoomContext } from '@/lib/roomContext'
import MessageThread from './messageThread';

/**
 * Handles displaying messages and message interactions
 */
export default function Message({ message }) {
    const dialog = useRef();
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
            <select 
                onInput={handleStatus} 
                value={message.status}
                disabled={user.email != room.owner 
                    && user.email != message.sender.email}
            >
                <option value='waiting' title="unanswered">&#10067;</option>
                <option value='urgent' title="urgent">&#10071;</option>
                <option value='answered' title="answered">&#9989;</option>
            </select>
    
            <div className='body'>
                <p>{message.body}</p>

                <small>
                    Sent by {
                        message.anonymous ? 'anonymous' : message.sender?.name
                    } at {
                        new Date(message.time).toLocaleTimeString()
                    }
                </small>
            </div>

            <div className='actions'>
                <button onClick={() => dialog.current?.showModal()}>
                    {message.replies.length} &#128172;	
                </button>
                <button 
                    onClick={e => {handleUpvote(e, message)}}
                    disabled={message.upvotes.find(email => email === user.email)}
                >
                    {message.upvotes.length} &#9757;
                </button>
            </div>
        </div>
        <dialog ref={dialog}>
            <button onClick={() => dialog.current?.close()}>close</button>
            <h1>
                <select 
                    onInput={handleStatus} 
                    value={message.status}
                    disabled={user.email != room.owner 
                        && user.email != message.sender.email}
                >
                    <option value='waiting' title="unanswered">&#10067;</option>
                    <option value='urgent' title="urgent">&#10071;</option>
                    <option value='answered' title="answered">&#9989;</option>
                </select>
                <div>
                    <p>{message.body}</p>
                    <small>Sent by {
                            message.anonymous ? 'anonymous' : message.sender?.name
                        } at {
                            new Date(message.time).toLocaleTimeString()
                        }
                    </small>
                </div>
            </h1>
            <br />
            <MessageThread message={message} />
        </dialog>
        <style jsx>{`
            .message {
                position: relative;
                padding: 5px;
                min-height: auto;
                border: 0.1em solid #eaeaea;
                font-size: 1.5em;
                border-radius: 5px;
                display: grid;
                grid-template-columns: 3.5em auto 4.5em;
                gap: 0.2em;
                width: auto;
            }

            .message:hover {
                background: rgba(var(--card-rgb), 0.1);
                border: 0.1em solid rgba(var(--card-border-rgb), 0.15);
            }

            select {
                display: flex;
                font-size: 2em;
                grid-column: 1;
                height: min-content;
            }

            option {
                text-align: center;
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
                text-align: left;
                grid-column: 2;
            }

            .body {
                position: relative;
                margin-left: 0.5em;
            }

            small {
                grid-column: 2;
                text-align: left;
                postion: absolute;
                bottom: 0;
                font-size: 0.5em;
                vertical-align: bottom;
                white-space: nowrap;
            }

            details {
                list-style: none;
            }

            details:hover {
                cursor: pointer;
            }

            .actions {
                display: flex;
                justify-content: right;
                padding: 0.2em;
            }

            .actions > button {
                height: 2em;
                min-width: 2.5em;
                font-size: 0.7em;
            }

            .actions > button ~ button {
                margin-left: 0.2em;
            }

            dialog {
                position:fixed;
                left: 50%;
                top: 50%;
                -ms-transform: translate(-50%,-50%);
                -moz-transform:translate(-50%,-50%);
                -webkit-transform: translate(-50%,-50%);
                transform: translate(-50%,-50%);
                width: 100%;
                height: 100%;
                padding: 1em;
                overflow-y: scroll;
                border-radius: 1em;
                background: rgba(var(--card-rgb));
                font-size: 1.5em;
            }

            dialog > button {
                position: fixed;
                top: 1em;
                right: 1em;
            }

            dialog > select {
                display: inline;
            }

            dialog > h1 {
                display: grid;
                grid-template-columns: 3.5em auto;
                gap: 1em;
                font-size: 2em;
            }
        `}</style>
    </>)
}