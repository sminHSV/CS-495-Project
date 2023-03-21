import useSWR from 'swr'
import { usePusher } from '@/lib/PusherContext'
import { fetchText, fetchJSON } from '@/lib/fetch';
import { useState, useEffect, useContext } from 'react'
import { RoomContext } from '@/lib/roomContext'

/**
 * JSX element containing the attendance code and attendance list.
 * Must be provided a RoomContext
 */
export default function AttendanceChart() {

    const {roomId, user} = useContext(RoomContext);
    const { data: dailyCode } = useSWR('/api/attendance/code?' + new URLSearchParams({ roomId }), fetchText);
    const channels = usePusher();
    const [members, setMembers] = useState(null);

    function updateMember(member) {
        setMembers(members => ({
            ...members,
            [member.email] : member
        }));
    }

    useEffect(() => {
        const channel = channels.subscribe(Buffer.from(roomId, 'base64').toString('hex'));

        channel.bind('member-update', function(member) {
            updateMember(member);
        });

        setMembers({});

        fetchJSON("/api/members?" + new URLSearchParams({ roomId }))
            .then(members => members.forEach(member => updateMember(member)));

    }, [channels, roomId]);

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
        <style jsx>{`
            .attendance {
                margin-left: 20px;
                overflow: hidden;
                overflow-y: scroll;
                overflow-x: scroll;
                height: auto;
            }
        `}</style>
    </>)
}