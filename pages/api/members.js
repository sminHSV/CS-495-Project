import Pusher from "pusher"
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

var ObjectId = require('mongodb').ObjectId;

const channels = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: 'us2',
});

export default async function Members(req, res) {
    const { roomId } = req.query;
    const channel = Buffer.from(roomId, 'base64url').toString('hex');

    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');

    if (req.method === 'GET') {
        const { members } = await rooms.findOne(
            { _id: roomId },
            { _id: 0, members: 1 }
        );
        res.send(members);
        return res.status(httpStatus.OK).end();
    }

    if (req.method === 'PUT') {
        const member = await req.body;
        const response = await rooms.updateOne(
            { _id: roomId, 'members.email': member.email },
            { $set: { 'members.$': member }}
        );

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }
        await channels.trigger(channel, 'member-update', member);
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
}