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

export default async function handler(req, res) {
    const { roomId } = await req.query;
    const channel = Buffer.from(roomId, 'base64url').toString('hex');
    
    const client = await clientPromise;
    const rooms = await client.db('cs495').collection('rooms');

    if (req.method === 'POST') {
        let message = await req.body;
        message = {
            _id: new ObjectId().toString(),
            ...message
        }

        const response = await rooms.updateOne(
            { _id: roomId },
            { $push: { messages: message } }
        );

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }
        await channels.trigger(channel, 'message-update', message);
        return res.status(httpStatus.OK).end();
    } 

    else if (req.method === 'GET') {
        const { messages } = await rooms.findOne(
            { _id: roomId },
            {_id: 0, messages: 1 }
        );

        if (messages) {
            res.send(messages);
            return res.status(httpStatus.OK).end();
        }
        return res.status(httpStatus.NOT_FOUND).end();
    }

    else if (req.method === 'PUT') {
        const message = await req.body;

        const response = await rooms.updateOne(
            { _id : roomId, 'messages._id': message._id },
            { $set: { 'messages.$': message } }
        );

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }
        await channels.trigger(channel, 'message-update', message);
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
}