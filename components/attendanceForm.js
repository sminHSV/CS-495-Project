import { useEffect, useState, useRef, useContext } from 'react'
import { RoomContext } from '@/lib/roomContext'

/**
 * JSX element containing the participants' attendance submission.
 * Handles updating the participants' attendance status.
 * Must be provided a RoomContext.
 */
export default function AttendanceForm() {

    const {roomId, user} = useContext(RoomContext);
    const [state, setState] = useState('absent');
    const code = useRef();

    useEffect(() => {
        fetch("/api/attendance/verify?"  + new URLSearchParams({ roomId, email: user.email }))
            .then(res => res.text())
            .then(res => {
                if (res === 'valid') {
                    setState('attending');
                } else if (state === 'submitting') {
                    setState('failed');
                }
            });
    }, [state, roomId, user.email]);

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        
        await fetch("/api/members?" + new URLSearchParams({ roomId }), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: user.email, 
                attendanceCode: code.current.value
            }),
        });

        code.current.value = '';
        setState('submitting');
    }

    return (
        <>
        {state === 'attending' ? <p>Attendance recorded &#x2705;</p>
        : <form onSubmit={e => handleSubmitCode(e)}>
            <label>
                Enter Attendance Code:<br/>
                <input type='text' 
                    ref={code}
                    placeholder='Enter code'
                    style={{width: '100%'}}
                />
            </label> <br/>
            <button type='submit'>
                submit
            </button> <br/>
            <span style={{color: 'red'}}>
                {state === 'failed' ? 'Invalid code' : ''}
            </span>
        </form>
        }
        </>
    );
}