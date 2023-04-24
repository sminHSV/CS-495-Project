import { useEffect, useState, useContext, useRef } from 'react'
import { RoomContext } from '@/lib/roomContext'
import styles from '@/styles/Home.module.css'

/**
 * Handles displaying messages and message interactions
 */
export default function Poll({ poll }) {
    const dialog = useRef();
    const {room, user, date} = useContext(RoomContext);
    const [voted, setVoted] = useState(
        poll.voters.some(voter => voter.user.email === user.email)
    );

    return (<>
        <h3>{poll.name}</h3>

        <button className={styles.plswork} onClick={() => {
            dialog.current.showModal();
        }}>vote</button>

        <dialog ref={dialog}>
            <h1>{poll.name}</h1>
            <button className='close' onClick={() => dialog.current?.close()}>close</button>
            <br />
            <ul>
                {poll.choices.map(choice => (
                    <li key={choice}>
                        <div>
                            <button disabled={voted} onClick={(e) => {
                                e.preventDefault();
                                setVoted(true);
                                
                                fetch('/api/polls?' + new URLSearchParams({roomId: room._id, date: date}), 
                                {
                                    method: 'PUT',
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        ...poll, voters: [...poll.voters, {user: user, choice: choice}]
                                    })
                                });
                            }}>
                                <h3> {choice} </h3>
                            </button>
                            <span className='voteCount'>
                                votes: {poll.voters.reduce((acc, vote) => 
                                    vote.choice === choice ? acc + 1 : acc, 0
                                )}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </dialog>
        <style jsx>{`
            dialog {
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                padding: 2em;
            }

            .close {
                position: fixed;
                top: 1em;
                right: 1em;
            }

            dialog > ul button {
                min-width: 20%;
                max-width: min-content;
                display: float;
            }

            .voteCount {
                display: float;
                float: right;
            }
        `}</style>
    </>)
}