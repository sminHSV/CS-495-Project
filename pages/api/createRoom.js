import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

var ObjectId = require('mongodb').ObjectId;

export default async function createRoom(req, res) {
    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');
    const users = client.db('cs495').collection('users');

    if (req.method === 'POST') {
        let room = await req.body;

        const id = String(new ObjectId());
        room._id = Buffer.from(id, 'hex').toString('base64');

        rooms.insertOne(room);
    
        room = { 
            _id: room._id, 
            name: room.name, 
            owner: room.owner,
        };

        users.updateOne(
            { email: room.owner.email },
            { $push: { rooms: room } }
        );
        
        res.send(room);
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
};