import React, { useEffect, useState, useRef, useContext} from 'react'
import { RoomContext } from '@/lib/roomContext'
import { PollContext } from '@/lib/pollContext'
import PollForm from "@/components/pollForm"
import { usePusher } from '@/lib/PusherContext'
import useUser from "@/lib/useUser"
import { fetchText, fetchJSON } from '@/lib/fetch';
import { useRouter } from "next/router"
import useSWR from 'swr'
import styles from "@/styles/Home.module.css"

export default function PollView({viewMyPolls}) {
    const {room, user, date} = useContext(RoomContext);
    // const { data: dailyCode } = useSWR('/api/poll?' + new URLSearchParams({ pollId: poll._id, date}), fetchText);
    const dialog = useRef();
    const channels = usePusher();
    const [state, setState] = useState('typing');
    const [myPolls, setMyPolls] = useState({});
    const router = useRouter();

    const [currPoll, setCurrPoll] = useState(null);

    function updatePolls(poll) {
        setMyPolls(polls => ({
            ...polls,
            [poll._id]: poll
        }));
    }

    useEffect(() => {
        fetch('/api/myPolls')
            .then(response => response.json())
            .then(polls => polls.forEach(poll => updatePolls(poll)));
    }, [myPolls]);

    function ignoreEnter(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    }

    return (<>
        <button className={styles.button} onClick={e => dialog.current.showModal()}>
            + View Polls
        </button>
        <dialog ref={dialog}>
        {!currPoll ? 
            <div className={styles.myRooms}>
                <h2 style={{display: 'inline'}}>
                    <span style={{color: 'red'}}>*</span> Polls
                </h2>
                <p>{myPolls ? '' : 'loading polls...'}</p>
                <br/>
                <div className={styles.myPolls}>
                    <ul>
                        {Object.values(myPolls)?.map(poll => (
                            <li key={poll._id}>
                                <div>
                                    <h3>{poll.name}</h3>
                                </div>
                     
                                <div className='actions'>
                                    <button className={styles.plswork} onClick={() => {
                                        setCurrPoll(poll);
                                        
                                    }}>vote</button>
                                    </div>
                            
                       
                                <br/>
                            </li>
                        ))}
                    </ul>
                    </div>
                <br />
            </div> : 
            <div>
            
                <h2>{currPoll.name}</h2>
                <ul>
                    {currPoll.choices.map(choice => (
                        <li key={choice}>
                            <div>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    e.target.disabled = true;
                                    
                                    fetch('/api/vote?' + new URLSearchParams({roomId: room._id, pollId: currPoll._id}), 
                                    {
                                        method: 'POST',
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({user: user, choice: choice})
                                    });
                                }}>
                                    <h3>{choice} {currPoll.voters.reduce((acc, vote) => 
                                        vote.choice === choice ? acc + 1 : acc
                                    , 0)}</h3>
                                    
                                </button>
                                <br/>
                              
                            </div>
                        </li>
                    ))}
                </ul>
                <br/>
            </div>
        }

  
            <button className={styles.button}type='button' onClick={() => {
                setCurrPoll(null);
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