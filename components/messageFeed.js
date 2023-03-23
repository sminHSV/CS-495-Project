import { useEffect, useState, useContext, useRef } from 'react'
import { usePusher } from '@/lib/PusherContext'
import { fetchJSON } from '@/lib/fetch'
import { RoomContext } from '@/lib/roomContext'
import Message from './message'

/**
 * Handles organising and sorting messages.
 */
export default function MessageFeed() {

    const {room, user} = useContext(RoomContext);
    const [messages, setMessages] = useState(null);
    const channels = usePusher();
    const [statusOrder, setStatusOrder] = useState({
        urgent: 0, waiting: 1, answered: 2
    })

    function updateMessage(message) {
        setMessages(messages => ({
            ...messages,
            [message._id] : message
        }));
    }

    useEffect(() => {
        const channel = channels.subscribe(Buffer.from(room._id, 'base64').toString('hex'));

        channel.bind('message-update', function(message) {
            updateMessage(message);
        });

        setMessages({});
        
        fetchJSON("/api/messages?" + new URLSearchParams({ roomId: room._id }))
            .then(messages => messages.forEach(message => updateMessage(message)));

    }, [channels, room]);

    return (messages ? 
        <ul>{ 
            Object.values(messages)
                .sort((a, b) => (Number(a.time) - Number(b.time)))
                .sort((a, b) => b.upvotes.length - a.upvotes.length)
                .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
                .map(message => <li key={message._id}>
                    <Message message={message} />
                </li>)
        }</ul>

        : <p>Loading messages...</p> 
    )
}