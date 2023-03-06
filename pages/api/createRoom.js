import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'
import bcrypt from 'bcryptjs'

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

        for (let email of room.members) {
            const response = await users.updateOne(
                { email: email.toLowerCase() }, 
                { $push: { rooms: room._id }}
            );
            if (response.matchedCount === 0) {
                const hash = await bcrypt.hash(process.env.APP_PASSWORD, 10);

                users.insertOne({ 
                    email: email.toLowerCase(), 
                    password: hash, 
                    name: 'anonymous', 
                    rooms: [room._id],
                    registered: false,
                });
            }
        }

        await users.updateOne(
            { email: room.owner },
            { $push: { rooms: room._id } }
        );
        
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
};