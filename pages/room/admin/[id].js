import Link from 'next/link'
import { fetchJSON } from '@/lib/fetch'

import { RoomContext } from '@/lib/roomContext'

import useSWR from 'swr'
import useUser from '@/lib/useUser'

import MessageFeed from '@/components/messageFeed'
import MessageForm from '@/components/messageForm'
import AttendanceChart from '@/components/attendanceChart'

export default function Room({ roomId }) {

    const { user } = useUser();
    const { data: room, error } = useSWR('/api/room?' + new URLSearchParams({ roomId }), fetchJSON);

    if (error) return <p>Couldn&apos;t load room</p>
    if (!room) return <p>Loading room...</p>
    if (!user) return <p>Authorizing user...</p>

    if (user.email !== room.owner) return <p>Unauthorized access</p>

    return (<>
        <div style={{margin: '10px'}}>
            <h1>Welcome to {room.name}</h1>
            <Link href="/" className='link'>Leave room</Link>
            <br /><br />
            <div className='grid'>
                <RoomContext.Provider value={{room, user}}>
                    <div className='terminal'>
                        <MessageFeed />
                    </div>
                    <div className='inputBox'>
                        <MessageForm />
                    </div>
                    <div className='subTerminal'>
                        <AttendanceChart />
                    </div>
                </RoomContext.Provider>
            </div>
        </div>              
        <style jsx>{`
            .grid {
                display: grid;
                grid-template-columns: repeat(3, 30vw);
                gap: 10px;
                grid-template-rows: repeat(4, 20vh);
            }

            .terminal {
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                grid-column: 1 / 3;
                grid-row: 1 / 4;
                overflow: hidden;
                overflow-y: scroll;
                padding: 5px;
            }

            .subTerminal {
                color: inherit;
                border: 1px solid #eaeaea;
                border-radius: 10px;
                grid-column: 3;
                grid-row: 1 / 4;
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
                grid-row: 4;
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