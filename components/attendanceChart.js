import useSWR from 'swr'
import { usePusher } from '@/lib/PusherContext'
import { fetchText, fetchJSON } from '@/lib/fetch';
import { useState, useEffect, useContext } from 'react'
import { RoomContext } from '@/lib/roomContext'
import styles from "@/styles/Home.module.css";

/**
 * JSX element containing the attendance code and attendance list.
 * Must be provided a RoomContext
 */


export default function AttendanceChart() {

    const {room, user, date} = useContext(RoomContext);
    const { data: dailyCode } = useSWR('/api/attendance/code?' + new URLSearchParams({ roomId: room._id, date}), fetchText);
    const channels = usePusher();

    const [attendance, setAttendance] = useState(
        Object.fromEntries(room.members.map(email => [email, 'absent']))
    );

    function updateAttendance(record) {
        setAttendance(members => ({
            ...members,
            [record.email] : 'present'
        }));
    }

    function exportAttendees() {
        if (attendance) {
          const rows = Object.entries(attendance).map(([email, status]) => [
            status, email,
          ]);
      
          const csvContent =
            "data:text/csv;charset=utf-8," +
            rows.map((row) => row.join(",")).join("\n");
      
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "attendees.csv");
          document.body.appendChild(link);
          link.click();
        }

    }


    useEffect(() => {
        const channel = channels.subscribe(Buffer.from(room._id, 'base64').toString('hex'));

        channel.bind('attendance-update', function(record) {
            updateAttendance(record);
        });

        for (const email of room.members) {
            setAttendance(members => ({
                ...members,
                [email] : 'absent'
            }));
        }

        fetchJSON("/api/attendance/records?" + new URLSearchParams({ roomId: room._id, date }))
            .then(records => records.forEach(record => updateAttendance(record)));
        
    }, [channels, room, date]);

    return (<>
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        <h2>Attendance Code:&nbsp;{dailyCode || 'getting code...'}</h2>
        <br />
        <div className='attendance'>
            {attendance ? 
                <ul>
                    {Object.entries(attendance).map(([email, status]) => (
                        <li key={email}>
                            {status === 'present' ?
                                <>&#x2705;</> : <>&#x274C;</>}
                            &nbsp;{email}
                        </li>
                    ))}
                </ul>
            : <p>Loading attendance...</p>}
        </div>
        <br />
        <div className="button-container">
            <button onClick={exportAttendees} className="export-button">Export Attendees</button>
        </div>
    </div>
    
    <style jsx>{`
        .attendance {
            margin-left: 20px;
            overflow: hidden;
            overflow-y: scroll;
            min-width: max-content;
            flex-grow: 2;
        }

        .attendance ul {
            height: 100%;
        }

        .button-container {
            display: flex;
            justify-content: flex-end;
            margin-right: 20px;
        }
        .export-button {
            font-size: 14px;
            padding: 10px;
            background-color: #003249; 
            border: none;
            color: white;
        `}

        
    </style>
    </>)
}