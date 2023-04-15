import { useEffect, useState, useContext, useRef } from 'react'
import { usePusher } from '@/lib/PusherContext'
import { fetchJSON } from '@/lib/fetch'
import { RoomContext } from '@/lib/roomContext'
import Message from './message'
import { saveAs } from 'file-saver'

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

    function exportThreads(){
        if(messages){
            var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "hello world.txt");
        }
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

    return (<>{messages ? 
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
        }
        <div className='button-container'>
        <button onClick={exportThreads} className="export-button">Export Questions/Threads</button>
        </div>
        <style jsx>{`
            li {
                margin-bottom: 5px;
            }
            .button-container {
                display: flex;
                justify-content: flex-end;
                margin-right: 20px;
                margin-bottom: 20px;
            }
            .export-button {
                font-size: 14px;
                padding: 10px;
                background-color: #003249; 
                border: none;
                color: white;
            }
        `}</style> 
    </>)
}