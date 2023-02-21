import Pusher from "pusher"
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

const channels = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: 'us2',
});

export default async function handler(req, res) {
    const { channel } = await req.query;

    const client = await clientPromise;
    let room = await client.db('cs495').collection('room' + channel);
    
    if (!room) {
        room = client.db('cs495').createCollection('room' + channel);
    }

    if (req.method === 'POST') {
        const message = await req.body;

        await room.insert(message);

        await channels.trigger(channel, 'message-sent', message)

        return res.status(httpStatus.OK).end();
    } 

    else if (req.method === 'GET') {
        if (room) {
            const messages = await room.find().toArray();
            res.send(messages);
            return res.status(httpStatus.OK).end();
        }
        return res.status(httpStatus.BAD_REQUEST).end();
    }

    else if (req.method === 'PUT') {
        const message = await req.body;
        room.replaceOne({_id: message._id}, message);

        await channels.trigger(channel, 'message-edit', message);

        return res.status(httpStatus.OK).end();
    }
    
}