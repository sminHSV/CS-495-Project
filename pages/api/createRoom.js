import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

var ObjectId = require('mongodb').ObjectId;

export default async function createRoom(req, res) {
    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');
    const users = client.db('cs495').collection('users');

    if (req.method === 'POST') {
        let room = await req.body;

        const id = new ObjectId().toString();
        room._id = Buffer.from(id, 'hex').toString('base64url');

        rooms.insertOne(room);

        users.updateOne(
            { email: room.owner },
            { $push: { rooms: room._id } }
        );

        for (let member of room.members) {
            const email = member.email;
            users.updateOne(
                { email: email }, 
                { $push: { rooms: room._id }}
            ).then(res => {
                if (res.matchedCount === 0) {
                    users.insertOne({ 
                        email: email, 
                        password: '', 
                        name: 'anonymous', 
                        rooms: [room._id],
                        registered: false,
                    });
                }
            })
        }
        
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
};