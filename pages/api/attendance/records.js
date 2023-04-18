import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'
import Pusher from "pusher"

const channels = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: 'us2',
});

export default async function records(req, res) {
    const client = await clientPromise;
    const attendance = await client.db('cs495').collection('attendance');

    if (req.method === 'GET') {
        const { roomId, date } = req.query;
    
        const result = await attendance.find(
            { roomId: roomId, time: { $gte: Number(date), $lt: Number(date) + 86400000 } },
        );
    
        res.send(await result.toArray());
        return res.status(httpStatus.OK).end();
    }

    if (req.method === 'POST') {
        const record = await req.body;
        const channel = Buffer.from(record.roomId, 'base64url').toString('hex');

        const response = await attendance.insertOne(record);

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }
        await channels.trigger(channel, 'attendance-update', record);
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST);
};