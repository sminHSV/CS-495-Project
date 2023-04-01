import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import useUser from "@/lib/useUser"
import { useRouter } from "next/router"

export default function Dashboard() {
    const { user } = useUser();
    const [myRooms, setMyRooms] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/myRooms')
            .then(response => response.json())
            .then(rooms => setMyRooms(rooms));
    }, [myRooms]);

    if (!user) return <p>Loading...</p>
    
    return (
        <div style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <div>
                <h1>Welcome, { user?.name }</h1>
                <Link href="/" className='link'>Go back</Link>
                <br/><br/><br/>

                <div className='myRooms'>
                    <h2>My Rooms:</h2><br/>
                    <RoomForm setMyRooms={setMyRooms}/>
                    <button style={{marginLeft: '20px'}}>+ add room</button>
                    <br/><br/>
                    <p>{myRooms ? '' : 'loading rooms...'}</p>
                    <ul>
                        {myRooms?.map(room => (
                            <li key={room._id}>
                                <div><h3>{room.name}</h3>
                                    <small>Id: {room._id}</small>
                                </div>
                                <div className='actions'>
                                    <button onClick={() => {
                                        if (user.email === room.owner) {
                                            router.push('/room/admin/' + room._id);
                                        } else {
                                            router.push('/room/' + room._id);
                                        }
                                    }}>join</button>
                                    <button>⚙️</button>
                                    <button>&#x274C;</button>
                                </div>
                                <br/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <br/>
            <style jsx>{`
                .myRooms ul {
                    overflow: hidden;
                    overflow-y: scroll;
                    height: 400px;
                    width: 300px;
                }

                .myRooms li {
                    width: auto;
                    display: grid;
                    grid-template-columns: 150px auto;
                }

                .myRooms li > .actions {
                    visibility: hidden;
                }

                .myRooms li > .actions > button + button {
                    margin-left: 10px
                }

                .myRooms li:hover > .actions {
                    visibility: visible;
                }

                .myRooms small {
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
}

function RoomForm({setMyRooms}) {
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

        let room = {
            name: roomName.current.value,
            owner: user.email,
            members: members,
            schedule: schedule,
            messages: []
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

    return (
        <>
          <button onClick={(e) => dialog.current.showModal()}>
            + create room
            </button>
      <dialog
        ref={dialog}
        style={{
          maxHeight: "80vh",
          overflowY: "scroll",
          padding: "20px",
          width: "400px",
        }}
      >
            {state === "submitting" ? (
              <p>creating room...</p>
            ) : (
              <div
              >
                <form method="dialog" onSubmit={(e) => handleSubmit(e)}>
                  {/* ... */}
                  <div className="meetingTimes">
                    <div>
                      <h2>Meeting Times:</h2>
                      <br />
                      <div className="timechart">
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
                  <div className="participants">
                    <div>
                      <h2>Participants:</h2>
                      <br />
                      <textarea
                        ref={participants}
                        placeholder="Enter email addresses separated by commas"
                      ></textarea>
                    </div>
                  </div>
                  <button type="button" onClick={() => dialog.current.close()}>
                    cancel
                  </button>
                  <button type="submit" disabled={state === "submitting"}>
                    submit
                  </button>
                </form>
              </div>
            )}
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
                    position: fixed;
                    left: 50%;
                    margin-left: -250px;
                    top: 20%;
                    padding: 20px;
                }

                dialog > form {
                    margin: 10px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }
            `}</style>


            </>
    );
}


       

                        