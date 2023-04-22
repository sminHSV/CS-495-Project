import React, { useEffect, useState, useRef, useContext} from 'react'
import { RoomContext } from '@/lib/roomContext'
import useUser from "@/lib/useUser"
import { fetchText, fetchJSON } from '@/lib/fetch';
import styles from "@/styles/Home.module.css"

export default function PollForm({setMyPolls}) {
    const {room, user, date} = useContext(RoomContext);
    const dialog = useRef();
    const pollName = useRef();
    const pollNumOptions = useRef();
    const options = useRef();
    const [state, setState] = useState('typing');

    async function handleSubmit(e) {
        e.preventDefault();
        setState('submitting');
        // options represents all text
        //choices represents options split up
        const choices = options.current.value.toLowerCase().split(/[,\s]+/);
        if (choices[choices.length] === '') choices.pop();
        // 
        let poll = {
            name: pollName.current.value,
            roomPoll:room._id,
            owner: user.email,
            numOfOptions: pollNumOptions.current.value,
            choices: choices,
            voters: [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }

        await fetch('/api/createPoll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(poll),
        });
        setMyPolls(null); //?
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
                <h2 style={{display: 'inline'}}>
                    <span style={{color: 'red'}}>*</span> Number of Options:
                    <input 
                        type='number' 
                        placeholder=''
                        style={{
                            marginLeft: '10px'
                        }}
                        onKeyDown={ignoreEnter}
                        ref={pollNumOptions}
                        required
                    />
                </h2>
                <br/>
                {/* Options */}
                <div className='options'>
                    <div>
                        <h2>Options:</h2>
                        <br/>
                        <textarea ref={options}
                            placeholder='Enter options separated by commas'
                        ></textarea>
                    </div>
                </div>
                <br />
                <div className='buttons'>
                    <button type='button' onClick={() => dialog.current.close()}>
                        cancel
                    </button>
                    <button    
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