import Link from 'next/link'
import { fetchJSON } from '@/lib/fetch'

import { RoomContext } from '@/lib/roomContext'

import useSWR from 'swr'
import useUser from '@/lib/useUser'
import { useState } from 'react'

import MessageFeed from '@/components/messageFeed'
import AttendanceForm from '@/components/attendanceForm'
import MessageForm from '@/components/messageForm'
import AttendanceChart from '@/components/attendanceChart'


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
            fontSize: '15px',
        }}>
            <h1>{room.name}</h1>
            <Link href="/" className='link'>Leave room</Link>
            <br /><br />
            <RoomContext.Provider value={{room, user, date}}>
                <div className='layout'>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div className='date'><input type='date' 
                            defaultValue={today.toLocaleDateString('en-CA')}
                            onInput={(e) => {
                                let date = e.target.valueAsDate;
                                date = new Date(
                                    date.getUTCFullYear(),
                                    date.getUTCMonth(),
                                    date.getUTCDate(),
                                    date.getUTCHours(),
                                    date.getUTCMinutes(),
                                    date.getUTCSeconds(),
                                    date.getUTCMilliseconds());
                                setDate(date.getTime());
                            }}/>
                        </div>
                        {!admin && <div className='attendanceForm'>
                            <AttendanceForm disabled={today.getTime() != date} />
                        </div>}
                    </div>
                    <div className='terminal'>
                        <MessageFeed />
                    </div>
                    {admin && <div className='subTerminal'> 
                        <AttendanceChart />
                    </div>}
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
                max-width: max-content;
                display: grid;
                grid-template-columns: minmax(max-content, 800px) auto;
                grid-template-rows: auto 60vh auto;
            }

            .date {
                align-self: flex-end;
            }

            .date > input {
                width: min-content;
                height: min-content;
            }

            .terminal {
                position: relative;
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                
                overflow: hidden;
                overflow-y: scroll;
                padding: 5px;
                grid-column: 1 / 2;
            }

            .subTerminal {
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                grid-column: 3;
                padding: 10px;
            }

            .inputBox {
                margin-top: 5px;
                position: relative
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                display: flex;
                align-items: center;
                padding: 10px;
                grid-column: 1 / 4;
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

