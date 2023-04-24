import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'
import Pusher from "pusher"

var ObjectId = require('mongodb').ObjectId;

const channels = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: 'us2',
});

export default async function createPoll(req, res) {
    const client = await clientPromise;
    const polls = client.db('cs495').collection('poll');

    const { roomId, date } = await req.query;
    const channel = Buffer.from(roomId, 'base64url').toString('hex');

    if (req.method === 'POST') {
        let poll = await req.body;

        await polls.insertOne(poll);
  
        await channels.trigger(channel, 'poll-update', poll);
        return res.status(httpStatus.OK).end();
    }

    else if (req.method === 'GET') {
        const cursor = await polls.find({ 
            roomId: roomId, 
            time: { $gte: Number(date), $lt: Number(date) + 86400000},
        });

        res.send(await cursor.toArray());
        return res.status(httpStatus.OK).end();
    }

    else if (req.method === 'PUT') {
        const poll = await req.body;
        const {_id: _, ...update} = poll;

        const response = await polls.updateOne(
            { _id: new ObjectId(poll._id) },
            { $set: update }
        );

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }
        await channels.trigger(channel, 'poll-update', poll);
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
};