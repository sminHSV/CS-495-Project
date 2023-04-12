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

    const {room, user} = useContext(RoomContext);
    const { data: dailyCode } = useSWR('/api/attendance/code?' + new URLSearchParams({ roomId: room._id }), fetchText);
    const channels = usePusher();
    const [members, setMembers] = useState(null);

    function updateMember(member) {
        setMembers(members => ({
            ...members,
            [member.email] : member
        }));
    }

    function exportAttendees() {
        if (members) {
          const rows = Object.values(members).map((member) => [
            member.attendanceCode === dailyCode ? "Present" : "Absent",
            member.email,
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

        channel.bind('member-update', function(member) {
            updateMember(member);
        });

        setMembers({});

        fetchJSON("/api/members?" + new URLSearchParams({ roomId: room._id }))
            .then(members => members.forEach(member => updateMember(member)));

    }, [channels, room]);

    return (<>
        <h2>Attendance Code:&nbsp;{dailyCode || 'getting code...'}</h2>
        <div className='attendance'>
            {members ? 
                <ul>
                    {Object.values(members).map(member => (
                        <li key={member.email}>
                            {member.attendanceCode === dailyCode ?
                                <>&#x2705;</> : <>&#x274C;</>}
                            &nbsp;{member.email}
                        </li>
                    ))}
                </ul>
            : <p>Loading attendance...</p>}
        </div>
        <button onClick={exportAttendees} className="export-button">Export Attendees</button>
        <style jsx>{`
            .attendance {
                margin-left: 20px;
                overflow: hidden;
                overflow-y: scroll;
                overflow-x: scroll;
                height: auto;
            }
            .export-button {
                font-size: 14px;
                padding: 6px 12px;
                background-color: #003249; 
                border: none;
                color: white;
        `}
            
        </style>
    </>)
}