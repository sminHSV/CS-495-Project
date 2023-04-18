import Link from 'next/link'
import { fetchJSON } from '@/lib/fetch'

import { RoomContext } from '@/lib/roomContext'

import useSWR from 'swr'
import useUser from '@/lib/useUser'
import { useState, useEffect, useRef } from 'react'

import MessageFeed from '@/components/messageFeed'
import AttendanceForm from '@/components/attendanceForm'
import MessageForm from '@/components/messageForm'
import AttendanceChart from '@/components/attendanceChart'
import styles from "@/styles/Home.module.css";

export default function Room({ roomId }) {
    
    const { user } = useUser();
    const { data: room, error } = useSWR('/api/room?' + new URLSearchParams({ roomId }), fetchJSON);

    const today = new Date();
    today.setHours(0,0,0,0);
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

    const admin = room.owner === user.email;

    if (!room.members.includes(user.email) 
        && room.visability === 'private' 
        && !admin) {
        return (<> 
            <p>Unauthorized access</p>
            <Link href="/" className='link'>Go Back</Link>
            <div>

            </div>
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
                                    date.getUTCDate());
                                setDate(date.getTime());
                            }}/>
                            
                        </div>
                       {/* Quiz Functionality Beginning */}
                       {admin && <div className='button-container'> 
                       <a href="/join">
                         <button className='export-button'>Make Poll</button>
                        </a> 
                       </div>}
                       {/* Quiz Functionality End */}
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
                grid-template-columns: minmax(max-content, 100vw) auto;
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
    </>);
}

export function getServerSideProps(context) {
    return {
        props: { 
            roomId: context.params.id, 
        }
    };
}

