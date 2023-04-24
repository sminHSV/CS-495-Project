import React, { useEffect, useState, useRef } from 'react'
import useUser from "@/lib/useUser"
import styles from "@/styles/Home.module.css"

export default function RoomForm({setMyRooms}) {
    const { user } = useUser();
    const dialog = useRef();
    const roomName = useRef();
    const participants = useRef();
    const [state, setState] = useState('typing');

    const [schedule, setSchedule] = useState({
        mon: { start: '', end: '' },
        tue: { start: '', end: '' },
        wed: { start: '', end: '' },
        thu: { start: '', end: '' },
        fri: { start: '', end: '' },
        sat: { start: '', end: '' },
        sun: { start: '', end: '' }
    });

    function handleScheduleChange(time, day, bound) {
        setSchedule(schedule => ({
            ...schedule,
            [day]: {
                ...schedule[day],
                [bound]: time
            },
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setState('submitting');

        let emails = participants.current.value.toLowerCase().split(/[,\s]+/);
        emails = emails.reduce((emails, email) => {
            if (!email.match(/^[\s]*$/)) {
                return emails.concat([email]);
            } else {
                return emails;
            }
        }, []);

        let  visability = 'public'
        if(emails.length !== 0) visability = 'private';

        let room = {
            name: roomName.current.value,
            owner: user.email,
            members: emails,
            schedule: schedule,
            polls:[],
            visability: visability,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }

        await fetch('/api/createRoom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(room),
        });
        setMyRooms(null);
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
        <button className={styles.plswork} onClick={e => dialog.current.showModal()}>
            + create room
        </button>
        <dialog ref={dialog}>
            {state === 'submitting' ? 
                <p>creating room...</p>
            :
            <form method='dialog' onSubmit={e => handleSubmit(e)}>
                <h2 style={{display: 'inline'}}>
                    <span style={{color: 'red'}}>*</span> Room Name:
                    <input 
                        type='text' 
                        placeholder='Enter a room name'
                        style={{
                            marginLeft: '10px'
                        }}
                        onKeyDown={ignoreEnter}
                        ref={roomName}
                        required
                    />
                </h2>
                <br/><br/>
                <div className='participants'>
                    <div>
                        <h2>Participants:</h2>
                        <br/>
                        <textarea ref={participants}
                            placeholder='Enter email addresses separated by commas'
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