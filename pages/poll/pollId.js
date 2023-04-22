import Link from 'next/link'
import { fetchJSON } from '@/lib/fetch'

import { RoomContext } from '@/lib/roomContext'
import { PollContext } from '@/lib/pollContext'
import useSWR from 'swr'
import useUser from '@/lib/useUser'
import { useState, useEffect, useRef } from 'react'

import MessageFeed from '@/components/messageFeed'
import AttendanceForm from '@/components/attendanceForm'
import MessageForm from '@/components/messageForm'
import AttendanceChart from '@/components/attendanceChart'
import PollForm from "@/components/pollForm"
import PollView from "@/components/pollView"
import styles from "@/styles/Home.module.css";

export default function Poll({ pollId }) {
    
    const { user } = useUser();
    const { data: poll, error } = useSWR('/api/poll?' + new URLSearchParams({ pollId }), fetchJSON);


    // if (error) return <p>Couldn&apos;t load room</p>
    // if (!poll) return <p>Loading room...</p>
    // if (!user) return <p>Authorizing user...</p>

    // const admin = room.owner === user.email;

    // if (!room.members.includes(user.email) 
    //     && room.visability === 'private' 
    //     && !admin) {
    //     return (<> 
    //         <p>Unauthorized access</p>
    //         <Link href="/" className='link'>Go Back</Link>
    //         <div>

    //         </div>
    //     </>);
    // }

    return (<>
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '15px',
        }}>
            <h1>{poll.name}</h1>
            <Link href="/" className='link'>Leave Poll</Link>
            
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
            .participants {
                width: 80%;
            }

            .participants textarea {
                width: 100%;
                height: 10em;
            }

            dialog {
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                padding: 1em;
            }

            form {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .buttons {
                width: 80%;
                display: flex;
                justify-content: space-between;
            }

            .buttons button {
                width: 45%;
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

