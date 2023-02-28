import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import useUser from "@/lib/useUser"
import useSWR from 'swr'
import { hex2a } from '@/lib/string'

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Dashboard() {
    const {data: user} = useUser();
    const { data: myRooms } = useSWR('/api/myRooms', fetcher);

    function sendEmails(e) {

    }
    
    return (
        <div style={{margin: '20px'}}>
            <h1>Welcome, { user?.name }</h1>
            <Link href="/" className='link'>Go back</Link>
            <br /><br />

            <label htmlFor='myrooms'>My Rooms:</label>
            <div id='myrooms'>
                <ul>
                    {myRooms?.forEach(room => (
                        <li key={room._id}>
                            {room.name}, Id: {hex2a(room._id)}
                            <button>&#128394; edit</button>
                        </li>
                    ))}
                </ul>
            </div>
            <br/>
            <RoomForm user/>
        </div>
    );
}

function RoomForm() {
    const [openForm, setOpenForm] = useState(false);
    const [schedule, setSchedule] = useState({
        mon: { start: '', end: '' },
        tue: { start: '', end: '' },
        wed: { start: '', end: '' },
        thu: { start: '', end: '' },
        fri: { start: '', end: '' },
        sat: { start: '', end: '' },
        sun: { start: '', end: '' }
    });
    const roomName = useRef('');
    const emails = useRef([]);

    function handleScheduleChange(time, day, bound) {
        setSchedule(schedule => {return ({
            ...schedule,
            [day]: {
                ...schedule[day],
                [bound]: time
            },
        })});

        console.log(schedule);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setOpenForm(false);
    }

    function ignoreEnter(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    }

    return (
        <div>
            <button onClick={e => setOpenForm(true)}>
                + create room
            </button>
            <dialog open={openForm}>
                <form method='dialog' onSubmit={e => handleSubmit(e)}>
                    <label>
                        <span style={{color: 'red'}}>*</span> Room Name: 
                        <input 
                            type='text' 
                            placeholder='Enter a room name'
                            style={{
                                marginLeft: '10px'
                            }}
                            onKeyDown={ignoreEnter}
                            required
                        >
                        </input>
                    </label>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'right',
                    }}><span style={{color: 'red'}}>*</span>: required</div>
                    <br/><br/>
                    <div className='meetingTimes'>
                        <div>
                            <h2>Meeting Times:</h2>
                            <br/>
                            <div className='timechart'>
                                <label>Mon:</label> 
                                <p>
                                    <input type='time' 
                                        onInput={e => handleScheduleChange(e.target.value, 'mon', 'start')}
                                        max={schedule.mon.end}
                                        required={schedule.mon.end !== ''}
                                    /> - <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'mon', 'end')}
                                        min={schedule.mon.start}
                                        required={schedule.mon.start !== ''}
                                    /> 
                                </p> <br/>
                                <label>Tue:</label> 
                                <p>
                                    <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'tue', 'start')}
                                        max={schedule.tue.end}
                                        required={schedule.tue.end !== ''}
                                    /> - <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'tue', 'end')}
                                        min={schedule.tue.start}
                                        required={schedule.tue.start !== ''}
                                    />                                
                                </p> <br/>
                                <label>Wed:</label> 
                                <p>
                                    <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'wed', 'start')}
                                        max={schedule.wed.end}
                                        required={schedule.wed.end !== ''}
                                    /> - <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'wed', 'end')}
                                        min={schedule.wed.start}
                                        required={schedule.wed.start !== ''}
                                    />                                
                                </p> <br/>
                                <label>Thu:</label> 
                                <p>
                                    <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'thu', 'start')}
                                        max={schedule.thu.end}
                                        required={schedule.thu.end !== ''}
                                    /> - <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'thu', 'end')}
                                        min={schedule.thu.start}
                                        required={schedule.thu.start !== ''}
                                    />                                
                                </p> <br/>
                                <label>Fri:</label> 
                                <p>
                                    <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'fri', 'start')}
                                        max={schedule.fri.end}
                                        required={schedule.fri.end !== ''}
                                    /> - <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'fri', 'end')}
                                        min={schedule.fri.start}
                                        required={schedule.fri.start !== ''}
                                    />                      
                                </p> <br/>
                                <label>Sat:</label> 
                                <p>
                                    <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'sat', 'start')}
                                        max={schedule.sat.end}
                                        required={schedule.sat.end !== ''}
                                    /> - <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'sat', 'end')}
                                        min={schedule.sat.start}
                                        required={schedule.sat.start !== ''}
                                    /> 
                                </p> <br/>
                                <label>Sun:</label> 
                                <p>
                                    <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'sun', 'start')}
                                        max={schedule.sun.end}
                                        required={schedule.sun.end !== ''}
                                    /> - <input type='time' 
                                        onChange={e => handleScheduleChange(e.target.value, 'sun', 'end')}
                                        min={schedule.sun.start}
                                        required={schedule.sun.start !== ''}
                                    /> 
                                </p> 
                            </div>
                        </div>
                    </div>
                    <div className='participants'>
                        <div>
                            <h2>Participants:</h2>
                            <br/>
                            <textarea 
                                placeholder='Enter email addresses separated by commas'
                            ></textarea>
                        </div>
                    </div>
                    <button onClick={e => setOpenForm(false)}>
                        cancel
                    </button>
                    <button type='submit'>
                        submit
                    </button>
                </form>
            </dialog>
            <style jsx>{`
                button {
                    margin-top: 20px;
                    margin-left: 20px;
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
                    display: flex;
                    justify-self: center;
                }

                .timechart {
                    display: grid; 
                    grid-template-columns: 50px 220px;
                }

                .timechart > label {
                    grid-column: 1;
                }

                .timechart > p {
                    margin-left: 10px;
                }

                dialog {
                    position: absolute;
                    left: 50%;
                    margin-left: -250px;
                    width: 600px;
                }

                dialog > form {
                    margin: 10px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }
            `}</style>
        </div>
    )
}
