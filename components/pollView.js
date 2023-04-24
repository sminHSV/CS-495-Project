import React, { useEffect, useState, useRef, useContext} from 'react'
import { RoomContext } from '@/lib/roomContext'
import { usePusher } from '@/lib/PusherContext'
import styles from "@/styles/Home.module.css"
import Poll from './poll'

export default function PollView({viewMyPolls}) {
    const {room, user, date} = useContext(RoomContext);
    
    const dialog = useRef();
    const channels = usePusher();
    const [polls, setPolls] = useState({});

    function updatePolls(poll) {
        setPolls(polls => ({
            ...polls,
            [poll._id]: poll
        }));
    }

    useEffect(() => {
        const channel = channels.subscribe(Buffer.from(room._id, 'base64').toString('hex'));

        channel.bind('poll-update', function(poll) {
            updatePolls(poll);
        });

        fetch('/api/polls?' + new URLSearchParams({ roomId: room._id, date: date }))
            .then(response => response.json())
            .then(polls => polls.forEach(poll => updatePolls(poll)));
    }, [room, date, channels]);

    return (<>
        <button className={styles.button} onClick={e => dialog.current.showModal()}>
            + View Polls
        </button>
        <dialog ref={dialog}>
            <div className={styles.myRooms}>
                <h2 style={{display: 'inline'}}>
                    Polls
                </h2>
                <p>{polls ? '' : 'loading polls...'}</p>
                <br/>
                <div className={styles.myPolls}>
                    <ul>
                        {Object.values(polls)?.map(poll => (
                            <li key={poll._id}>
                                <Poll poll={poll} />
                            </li>
                        ))}
                    </ul>
                    </div>
                <br />
            </div>
        <br/>

        <button className={styles.button}type='button' onClick={() => {
            dialog.current.close()
        }}>
            Exit
        </button>
      
            
        </dialog>
        <style jsx>{`
            .options {
                width: 80%;
            }

            .options textarea {
                width: 100%;
                height: 10em;
            }

            dialog {
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                padding: 2em;
            }
            dialog2 {
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
                width: 100%;
                display: flex;
                justify-content: space-between;
            }

            .buttons button {
                width: 45%;
            }
            blackBoard{
                border: '1px solid black';
                border-radius: '5px';
              
            }
        `}</style>
    </>);
}