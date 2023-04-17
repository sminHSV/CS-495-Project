import { useEffect, useState, useRef, useContext } from 'react'
import { RoomContext } from '@/lib/roomContext'
import { fetchText, fetchJSON } from '@/lib/fetch';

/**
 * JSX element containing the participants' attendance submission.
 * Handles updating the participants' attendance status.
 * Must be provided a RoomContext.
 */
export default function AttendanceForm({ disabled }) {

    const {room, user, date} = useContext(RoomContext);
    const [state, setState] = useState('absent');
    const code = useRef();

    useEffect(() => {
        fetchJSON("/api/attendance/records?"  + new URLSearchParams({ roomId: room._id, date: date }))
            .then(res => {
                if (res.find(record => record.email === user.email)) 
                    setState('attending');
                else 
                    setState('absent');
            });
    }, [state, room, user.email, date]);

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        
        const result = await fetchText("/api/verify?" + new URLSearchParams({ 
            roomId: room._id, 
            date: date, 
            code: code.current.value 
        }));

        if (result === 'invalid') {
            setState('failed');
            return;
        }

        fetch("/api/attendance/records?", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomId: room._id,
                time: Date.now(),
                email: user.email,
            }),
        }).then(res => res.ok ? setState('attending') : setState('absent'));

        code.current.value = '';
        setState('submitting');
    }

    return (<>
        {state === 'attending' ? <p>Attendance recorded &#x2705;</p>
        : <form onSubmit={e => handleSubmitCode(e)}>
            <label>
                Attendance Code:
                <span style={{color: 'red'}}>
                    {state === 'failed' ? ' Invalid code' : ''}
                </span>
                <br/>
                <input type='text' 
                    ref={code}
                    placeholder='Enter code'
                    disabled={disabled}
                    required
                />
            </label>
            <button type='submit' disabled={disabled}>
                submit
            </button> <br/>
        </form>
        }
        <style jsx>{`
            input {
                width: 15em;
            }
        `}</style>
    </>);
}