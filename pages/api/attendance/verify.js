import httpStatus from 'http-status';
import clientPromise from '@/lib/mongodb';
import dailyCode from '@/lib/dailyCode';

export default async function Code(req, res) {
    const { roomId, email } = req.query;

    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');

    const {members: [{email: _, attendanceCode}]} = 
    await rooms.findOne(
        {_id: roomId, "members.email": email},
        {projection: {_id: 0, "members.$": 1}}
    );

    if (attendanceCode === dailyCode(roomId)) {
        res.send('valid');
    } else {
        res.send('invalid');
    }

    return res.status(httpStatus.OK).end();
}