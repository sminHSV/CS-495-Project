import httpStatus from 'http-status';
import clientPromise from '@/lib/mongodb';
import dailyCode from '@/lib/dailyCode';

export default async function Code(req, res) {
    const { roomId, email } = req.query;

    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');

    const result = await rooms.aggregate([
        {$match: {_id: roomId}},
        {$limit: 1},
        {$project: {
            members: {$filter: {
                input: '$members',
                as: 'member',
                cond: {$eq: ['$$member.email', email]},
            }},
            _id: 0
        }}
    ]);

    const {members: [{email: _, attendanceCode}]} = await result.next();

    if (attendanceCode === dailyCode(roomId)) {
        res.send('valid');
    } else {
        res.send('invalid');
    }

    return res.status(httpStatus.OK).end();
}