import React, { useEffect, useState, useRef, useContext} from 'react'
import { RoomContext } from '@/lib/roomContext'
import useUser from "@/lib/useUser"
import { fetchText, fetchJSON } from '@/lib/fetch';
import styles from "@/styles/Home.module.css"

export default function PollForm() {
    const {room, user, date} = useContext(RoomContext);
    const dialog = useRef();
    const pollName = useRef();
    const [choices, setChoices] = useState(['']);
    const [state, setState] = useState('typing');

    async function handleSubmit(e) {
        e.preventDefault();
        setState('submitting');

        let poll = {
            name: pollName.current.value,
            roomId:room._id,
            owner: user.email,
            choices: choices,
            voters: [],
            time: Date.now(),
        }

        await fetch('/api/polls?' + new URLSearchParams({roomId: room._id, date: date}), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(poll),
        });
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
        <button className={styles.button} onClick={e => dialog.current.showModal()}>
            + create poll
        </button>
        <dialog ref={dialog}>
            {state === 'submitting' ? 
                <p>creating poll...</p>
            :
            <form method='dialog' onSubmit={e => handleSubmit(e)}>
                <h2 style={{display: 'inline'}}>
                    <span style={{color: 'red'}}>*</span> Poll Question
                    <input 
                        type='text' 
                        placeholder='Enter a poll question'
                        style={{
                            marginLeft: '10px'
                        }}
                        onKeyDown={ignoreEnter}
                        ref={pollName}
                        required
                    />
                </h2>
                <br/>
                {/* Options */}
                <div className='options'>
                    <div>
                        <h2>Options:</h2>
                        <br/>
                        <ul>
                            {choices.map((choice, index) => {
                                return (
                                    <li key={index}>
                                        <div style={{display: 'flex'}}>
                                        <input
                                            type='text'
                                            placeholder='Enter an option'
                                            onKeyDown={ignoreEnter}
                                            onChange={e => {
                                                let newChoices = [...choices];
                                                newChoices[index] = e.target.value;
                                                setChoices(newChoices);
                                            }}
                                            value={choice}
                                            required
                                        />
                                        <button onClick={() => {
                                            let newChoices = [...choices];
                                            newChoices.splice(index, 1);
                                            setChoices(newChoices);
                                        }}>
                                            remove
                                        </button>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        <button onClick={() => {
                            let newChoices = [...choices];
                            newChoices.push('');
                            setChoices(newChoices);
                        }}>
                           + add option
                        </button>
                    </div>
                </div>
                <br />
                <div className='buttons'>
                    <button className={styles.button} type='button' onClick={() => dialog.current.close()}>
                        cancel
                    </button>
                    <button className={styles.button}   
                        type='submit'
                        disabled={state === 'submitting'}
                    >
                        submit
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
        `}</style>
    </>);
}