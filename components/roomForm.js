import React, { useEffect, useState, useRef } from 'react'
import useUser from "@/lib/useUser"

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

        const emails = participants.current.value.toLowerCase().split(/[,\s]+/);
        if (emails[emails.length] === '') emails.pop();

        const members = emails.map(email => ({ email, attendanceCode: '' }));
        let  visability = 'public'
        if(members[0].email != '') visability = 'private';

        let room = {
            name: roomName.current.value,
            owner: user.email,
            members: members,
            schedule: schedule,
            messages: [],
            visability: visability
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
        <button onClick={e => dialog.current.showModal()}>
            + create room
        </button>
        <dialog ref={dialog}>
            {state === 'submitting' ? 
                <p>creating room...</p>
            :
            <form method='dialog' onSubmit={e => handleSubmit(e)}>
                <h2 style={{display: 'flex', alignItems: 'center', gridColumn: '1 / 3'}}>
                    <p><span style={{color: 'red'}}>*</span> Room Name:</p>
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
                <div className='meetingTimes'>
                    <div>
                        <h2>Meeting Times:</h2>
                        <br/>
                        <div className='timechart'>
                            <label>Mon:</label> 
                            <div>
                                <input type='time' 
                                    onInput={e => handleScheduleChange(e.target.value, 'mon', 'start')}
                                    max={schedule.mon.end}
                                    required={schedule.mon.end !== ''}
                                /> - <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'mon', 'end')}
                                    min={schedule.mon.start}
                                    required={schedule.mon.start !== ''}
                                />  
                            </div> <br/>
                            <label>Tue:</label> 
                            <div>
                                <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'tue', 'start')}
                                    max={schedule.tue.end}
                                    required={schedule.tue.end !== ''}
                                /> - <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'tue', 'end')}
                                    min={schedule.tue.start}
                                    required={schedule.tue.start !== ''}
                                />                                
                            </div> <br/>
                            <label>Wed:</label> 
                            <div>
                                <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'wed', 'start')}
                                    max={schedule.wed.end}
                                    required={schedule.wed.end !== ''}
                                /> - <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'wed', 'end')}
                                    min={schedule.wed.start}
                                    required={schedule.wed.start !== ''}
                                />                                
                            </div> <br/>
                            <label>Thu:</label> 
                            <div>
                                <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'thu', 'start')}
                                    max={schedule.thu.end}
                                    required={schedule.thu.end !== ''}
                                /> - <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'thu', 'end')}
                                    min={schedule.thu.start}
                                    required={schedule.thu.start !== ''}
                                />                                
                            </div> <br/>
                            <label>Fri:</label> 
                            <div>
                                <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'fri', 'start')}
                                    max={schedule.fri.end}
                                    required={schedule.fri.end !== ''}
                                /> - <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'fri', 'end')}
                                    min={schedule.fri.start}
                                    required={schedule.fri.start !== ''}
                                />                      
                            </div> <br/>
                            <label>Sat:</label> 
                            <div>
                                <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'sat', 'start')}
                                    max={schedule.sat.end}
                                    required={schedule.sat.end !== ''}
                                /> - <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'sat', 'end')}
                                    min={schedule.sat.start}
                                    required={schedule.sat.start !== ''}
                                /> 
                            </div> <br/>
                            <label>Sun:</label> 
                            <div>
                                <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'sun', 'start')}
                                    max={schedule.sun.end}
                                    required={schedule.sun.end !== ''}
                                /> - <input type='time' 
                                    onChange={e => handleScheduleChange(e.target.value, 'sun', 'end')}
                                    min={schedule.sun.start}
                                    required={schedule.sun.start !== ''}
                                /> 
                            </div> 
                        </div>
                    </div>
                </div>
                <div className='participants'>
                    <div>
                        <h2>Participants:</h2>
                        <br/>
                        <textarea ref={participants}
                            placeholder='Enter email addresses separated by commas'
                        ></textarea>
                    </div>
                </div>
                <button type='button' onClick={() => dialog.current.close()}>
                    cancel
                </button>
                <button    
                    type='submit'
                    disabled={state === 'submitting'}
                >
                    submit
                </button>
            </form>}
        </dialog>
        <style jsx>{`
            form > button {
                margin-left: 20px;
                margin-top: 10px;
                margin-right: 20px;
            }

            .participants {
                grid-column: 2;
                display: flex;
                justify-self: center;
            }

            .participants textarea {
                width: 250px;
                height: 275px;
            }

            .meetingTimes {
                grid-column: 1;
            }

            .timechart {
                display: grid; 
                grid-template-columns: 50px 220px;
            }

            .timechart > label {
                grid-column: 1;
            }

            dialog {
                position: fixed;
                left: 50%;
                margin-left: -250px;
                top: 20%;
                padding: 20px;
            }

            dialog > form {
                margin: 10px;
                margin-bottom: 100px;
                display: grid;
                grid-template-columns: 1fr 1fr;
            }

            [type='time'] {
                width: 100px;
            }
        `}</style>
    </>);
}