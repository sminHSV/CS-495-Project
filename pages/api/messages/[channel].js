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
    const { channel } = await req.query;

    const client = await clientPromise;
    const rooms = await client.db('cs495').collection('rooms');
    let room = await rooms.findOne({ _id: channel });
    
    if (!room) {
        await rooms.insertOne({
            _id: channel,
            name: "",
            owner: null,
            members: [],
            messages: [],
        });

        room = await rooms.findOne({_id: channel});
    }

    if (req.method === 'POST') {
        let message = await req.body;
        message = {
            _id: new ObjectId(),
            ...message
        }

        await rooms.updateOne(
            { _id: channel },
            { $push: { messages: message } }
        );

        await channels.trigger(channel, 'message-update', message);

        return res.status(httpStatus.OK).end();
    } 

    else if (req.method === 'GET') {
        if (room) {
            res.send(room.messages);
            return res.status(httpStatus.OK).end();
        }
        return res.status(httpStatus.BAD_REQUEST).end();
    }

    else if (req.method === 'PUT') {
        const message = await req.body;
        const id = new ObjectId(message._id);

        await rooms.updateOne(
            { _id : channel, 'messages._id': id},
            { $set: { 'messages.$': { _id: id, ...message } } }
        );

        await channels.trigger(channel, 'message-update', message);

        return res.status(httpStatus.OK).end();
    }
    
}