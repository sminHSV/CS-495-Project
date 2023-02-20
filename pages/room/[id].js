import Link from 'next/link';
import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import useUser from '@/lib/useUser'

const channels = new Pusher(process.env.NEXT_PUBLIC_KEY, {
    cluster: 'us2',
});

export default function Room({ roomId }) {
    const [messages, setMessages] = useState([]);
    const [toSend, setToSend] = useState('');

    const {data: user} = useUser();

    const name = user ? user.name : 'guest';

    const channel = channels.subscribe(roomId);

    channel.unbind();

    channel.bind('message-sent', function(data) {
        setMessages(prev => [
            ...prev,
            { sender: data.sender, message: data.message },
        ]);
        channel.unbind();
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await fetch("/api/send_message/" + roomId, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: toSend, sender: name }),
        });
        if (!result.ok) {
            console.error('faied to send message');
        }
    };

    return (
        <>
       <h1>Welcome to room #{roomId}</h1>
       <br />
       <div>
        {messages.map((message, id) => (
            <div key={id}>
                <p>{message.sender}: {message.message}</p>
            </div>
        ))}
       </div>
        <form onSubmit={(e) => {handleSubmit(e)}}>
            <input
                type="text"
                value={toSend}
                onChange={(e) => setToSend(e.target.value)}
                placeholder="start typing...."
            />
        <button type="submit">Send</button>
        </form>
       <br />
       <Link href="/" className='link'>Leave room</Link>
       </>
    );
}

export function getServerSideProps(context) {
    return {
        props: { 
            roomId: context.params.id, 
        }
    };
}

