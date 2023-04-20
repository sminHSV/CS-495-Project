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

/**
 * Expects roomId as a query parameter.
 * 
 * POST: adds the given message to the message feed.
 * 
 * GET: sends the message feed as an array
 * 
 * PUT: updates the specified message (e.g. upvote count, replies)
 */
export default async function handler(req, res) {
    const { roomId, date } = await req.query;
    const channel = Buffer.from(roomId, 'base64url').toString('hex');
    
    const client = await clientPromise;
    const rooms = await client.db('cs495').collection('rooms');
    const messages = await client.db('cs495').collection('messages');

    if (req.method === 'POST') {
        let message = await req.body;
        const response = await messages.insertOne(message);

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }
        await channels.trigger(channel, 'message-update', message);
        return res.status(httpStatus.OK).end();
    } 

    else if (req.method === 'GET') {
        const cursor = await messages.find({ 
            roomId: roomId, 
            time: { $gte: Number(date), $lt: Number(date) + 86400000},
        });

        res.send(await cursor.toArray());
        return res.status(httpStatus.OK).end();
    }

    else if (req.method === 'PUT') {
        const message = await req.body;
        const {_id: _, replies: __, ...update} = message;

        const response = await messages.updateOne(
            { _id: new ObjectId(message._id) },
            { $set: update }
        );

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }
        await channels.trigger(channel, 'message-update', message);
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
}