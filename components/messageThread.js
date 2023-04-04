import MessageForm from "./messageForm"
import { RoomContext } from '@/lib/roomContext'
import { useEffect, useState, useContext, useRef } from 'react'
import { usePusher } from '@/lib/PusherContext'
import { fetchJSON } from '@/lib/fetch'

export default function MessageThread({ message }) {
    const {room, user} = useContext(RoomContext);
    const [replies, setReplies] = useState({});

    useEffect(() => {
        fetchJSON("/api/replies?" + new URLSearchParams({ roomId: room._id, messageId: message._id }))
            .then(messages => messages.forEach(reply => setReplies(replies => (
                {...replies, [reply._id]: reply})
        )));
    }, [room, message]);

    async function sendReply(reply) {
        console.log(message);
        fetch("/api/replies?" + new URLSearchParams({ roomId: room._id, messageId: message._id }), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reply),
        });
    }

    return (<>
        {replies === null ? <p>Loading...</p> :
            <ul>
                {Object.values(replies).map(reply => (
                    <li key={reply._id}>
                        <p>{reply.body}</p>
                        <small>
                            Sent by {
                                reply.anonymous ? 'anonymous' : reply.sender?.name
                            } at {
                                new Date(reply.time).toLocaleTimeString()
                            }
                        </small>
                    </li>
                ))}
            </ul>
        }
        <div style={{fontSize: '0.7em'}}>
            <MessageForm onSubmit={sendReply} prompt='Write a response...'/>
        </div>

        <style jsx>{`
            ul {
                list-style-type: none;
            }

            li ~ li {
                margin-top: 2em;
            }

            p {
                font-size: 1em;
                text-align: left;
            }
            small {
                font-size: 0.5em;
            }
        `}</style>
    </>)
}