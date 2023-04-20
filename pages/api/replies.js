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
    const { roomId: roomId, messageId: messageId } = await req.query;
    const channel = Buffer.from(roomId, 'base64url').toString('hex');
    
    const client = await clientPromise;
    const messages = await client.db('cs495').collection('messages');

    if (req.method === 'POST') {
        let reply = await req.body;
        await messages.insertOne(reply);

        const response = await messages.updateOne(
            { _id: new ObjectId(messageId) },
            { $push: {replies: new ObjectId(reply._id)} }
        );

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }

        const message = await messages.findOne(
            { _id: new ObjectId(messageId) }
        );
        await channels.trigger(channel, 'message-update', message);
        return res.status(httpStatus.OK).end();
    } 

    else if (req.method === 'GET') {
        let { replies: ids } = await messages.findOne(
            { _id: new ObjectId(messageId) },
            { _id: 0, replies: 1 }
        );

        ids = ids.map((id) => new ObjectId(id));

        const cursor = await messages.find(
            { _id: { $in: ids } },
        );

        await res.send(await cursor.toArray());
        return res.status(httpStatus.OK).end();
    }

    else if (req.method === 'PUT') {
        const reply = await req.body;
        const {_id: _, ...update} = reply;

        const response = await messages.updateOne(
            { _id: new ObjectId(reply._id) },
            { $set: update }
        );

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }

        const message = await messages.findOne(
            { _id: new ObjectId(messageId) }
        );
        await channels.trigger(channel, 'message-update', message);
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
}