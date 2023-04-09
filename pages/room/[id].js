import Link from 'next/link'
import { fetchJSON } from '@/lib/fetch'

import { RoomContext } from '@/lib/roomContext'

import useSWR from 'swr'
import useUser from '@/lib/useUser'

import MessageFeed from '@/components/messageFeed'
import AttendanceForm from '@/components/attendanceForm'
import MessageForm from '@/components/messageForm'

export default function Room({ roomId }) {
    
    const { user } = useUser();
    const { data: room, error } = useSWR('/api/room?' + new URLSearchParams({ roomId }), fetchJSON);
    

    async function sendMessage(message) {
        fetch("/api/messages?" + new URLSearchParams({ roomId: room._id }), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message),
        });
    }

    if (error) return <p>Couldn&apos;t load room</p>
    if (!room) return <p>Loading room...</p>
    if (!user) return <p>Authorizing user...</p>
    if (roomId == -1) return <p>Room is private. Ask host to add you to email list</p>

    return (<>
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '2lvh',
        }}>
            <h1>Welcome to {room.name}</h1>
            <Link href="/" className='link'>Leave room</Link>
            <br /><br />
            <RoomContext.Provider value={{room, user}}>
                <div className='attendance'><AttendanceForm /></div>
                <div className='layout'>
                    <div className='terminal'>
                        <MessageFeed />
                    </div>
                    <div className='inputBox'>
                        <MessageForm onSubmit={sendMessage} prompt='ask a question...'/>
                    </div>
                </div>
            </RoomContext.Provider>
        </div>        
        <style jsx>{`
            .layout {
                display: grid;
                grid-template-columns: repeat(3, 30vw);
                gap: 0.5em;
                grid-template-rows: repeat(5, 16vh);
            }

            .attendance {
                position: relative;
                font-size: 0.7em;
                display: flex;
                justify-content: right;
                margin-bottom: 0.2em;
            }

            .terminal {
                position: relative;
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                grid-column: 1 / 4;
                grid-row: 1 / 5;
                overflow: hidden;
                overflow-y: scroll;
                padding: 5px;
            }

            .subTerminal {
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                grid-column: 3;
                grid-row: 1 / 5;
                display: grid;
                grid-template-rows: fit-content(100%);
                gap: 20px;
                padding: 10px;
            }

            .inputBox {
                position: relative
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                grid-column: 1 / 4;
                grid-row: 5;
                padding: 15px;
            }
        `}</style>
    </>);
}

export function getServerSideProps(context) {
    return {
        props: { 
            roomId: context.params.id, 
        }
    };
}

