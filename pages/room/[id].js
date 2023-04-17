import Link from 'next/link'
import { fetchJSON } from '@/lib/fetch'

import { RoomContext } from '@/lib/roomContext'

import useSWR from 'swr'
import useUser from '@/lib/useUser'
import { useState } from 'react'

import MessageFeed from '@/components/messageFeed'
import AttendanceForm from '@/components/attendanceForm'
import MessageForm from '@/components/messageForm'

export default function Room({ roomId }) {
    
    const { user } = useUser();
    const { data: room, error } = useSWR('/api/room?' + new URLSearchParams({ roomId }), fetchJSON);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [ date, setDate ] = useState(today.getTime());

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

    const admin = user.email === room.owner;

    if (!room.members.includes(user.email) 
        && room.visability === 'private' 
        && !admin) {
        return (<> 
            <p>Unauthorized access</p>
            <Link href="/" className='link'>Go Back</Link>
        </>);
    }

    return (<>
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '2lvh',
        }}>
            <h1>{room.name}</h1>
            <Link href="/" className='link'>Leave room</Link>
            <br /><br />
            <RoomContext.Provider value={{room, user}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='date'><input type='date' 
                        defaultValue={today.toISOString().slice(0, 10)}
                        onInput={(e) => {
                            const offset = new Date().getTimezoneOffset() * 60 * 1000;
                            setDate(e.target.valueAsNumber + offset);
                        }}/>
                    </div>
                    <div className='attendanceForm'>
                        <AttendanceForm disabled={today.getTime() != date} />
                    </div>
                </div>
                <div className='layout'>
                    <div className='terminal'>
                        <MessageFeed date={ date } />
                    </div>
                    <div className='inputBox'>
                        <MessageForm 
                            onSubmit={sendMessage} 
                            prompt='ask a question...'
                            disabled={today.getTime() != date}
                        />
                    </div>
                </div>
            </RoomContext.Provider>
        </div>        
        <style jsx>{`
            .layout {
                width: max-content;  
            }

            .date {
                align-self: flex-end;
            }

            .date > input {
                width: min-content;
            }

            .terminal {
                position: relative;
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                height: 60vh;
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
                margin-top: 5px;
                position: relative
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                padding: 15px;
                height: 12vh;
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

