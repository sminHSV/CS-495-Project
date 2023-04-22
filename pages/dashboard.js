import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import useUser from "@/lib/useUser"
import { useRouter } from "next/router"
import RoomForm from "@/components/roomForm"
import styles from "@/styles/Home.module.css"

export default function Dashboard() {
    const { user } = useUser();
    const [myRooms, setMyRooms] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/myRooms')
            .then(response => response.json())
            .then(rooms => setMyRooms(rooms));
    }, [myRooms]);

    if (!user) return <p>Loading...</p>
    
    return (
        <div style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            // Border just for viewing
            border: '1px solid black',
            padding: '0px 20px 0px',
            backgroundColor: '#CCDBDC',
            borderRadius: '5px',
          
           
        }}>
            <div>
                <h1>Welcome, { user?.name }</h1>
                <Link href="/" className='link'>Go back</Link>
                <br/><br/><br/>

                <div className={styles.myRooms}>
                    <h2>My Rooms:</h2><br/>
                    <RoomForm setMyRooms={setMyRooms}/>
                    <br/><br/>
                    <p>{myRooms ? '' : 'loading rooms...'}</p>
                    <ul>
        
                        {myRooms?.map(room => (
                            <li key={room._id}>
                                <div className={styles.border}>
                                    <div>
                                        <h3>{room.name}</h3>
                                        <small>Id: {room._id}</small>
                                    </div>
                                    <div className='actions'>
                                        <button className={styles.plswork} onClick={() => {
                                            router.push('/room/' + room._id);
                                        }}>join</button>
                                        <button className={styles.plswork} >⚙️</button>
                                        <button className={styles.plswork}>&#x274C;</button>
                                    </div>
                                </div>
                                <br/>
                             
                            </li>

                        ))}
                    </ul>
                </div>
            </div>
            <br/>
        
        </div>
    );
}


       

                        