import React, { useEffect, useState, useRef, useContext} from 'react'
import { RoomContext } from '@/lib/roomContext'
import { PollContext } from '@/lib/pollContext'
import RoomForm from "@/components/pollForm"
import { usePusher } from '@/lib/PusherContext'
import useUser from "@/lib/useUser"
import { fetchText, fetchJSON } from '@/lib/fetch';
import { useRouter } from "next/router"
import useSWR from 'swr'
import styles from "@/styles/Home.module.css"

export default function PollView({viewMyPolls}) {
    const {poll, user, date} = useContext(PollContext);
    // const { data: dailyCode } = useSWR('/api/poll?' + new URLSearchParams({ pollId: poll._id, date}), fetchText);
    const dialog = useRef();
    const channels = usePusher();
    const [state, setState] = useState('typing');
    const [myPolls, setMyPolls] = useState(null);

    useEffect(() => {
        fetch('/api/myPolls')
            .then(response => response.json())
            .then(polls => setMyPolls(polls));
    }, [myPolls]);
    async function handleSubmit(e) {
        e.preventDefault();
        setState('submitting');
        viewMyPolls(null); 
        setState('typing');

        dialog.current.close();
    }

    function ignoreEnter(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    }

    return (<>
        <button onClick={e => dialog.current.showModal()}>
            + View Polls
        </button>
        <dialog ref={dialog}>
            {state === 'submitting' ? 
                <p>Redirecting...</p>
            :
            <form method='dialog' onSubmit={e => handleSubmit(e)}>
                <h2 style={{display: 'inline'}}>
                    <span style={{color: 'red'}}>*</span> Polls
                </h2>
                <br/>
                <ul>
          
                        {myPolls?.map(poll => (
                            <li key={poll._id}>
                                <div className={styles.border}>
                                    <div className='actions'>
                                        <button className={styles.plswork} onClick={() => {
                                            router.push('/poll/' + poll._id);
                                        }}>join</button>
                                    </div>
                                </div>
                                <br/>
                            </li>

                        ))}
                    </ul>








                <br />
                <div className='buttons'>
                    <button type='button' onClick={() => dialog.current.close()}>
                        Exit
                    </button>
                </div>
            </form>}
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
            blackBoard{
                border: '1px solid black';
                border-radius: '5px';
              
            }
        `}</style>
    </>);
}