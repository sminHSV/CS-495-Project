import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

var ObjectId = require('mongodb').ObjectId;

/**
 * Inserts a new room into the database.
 * FIXME: adding a large number of members to a room may
 * cause the request to timeout.
 */
export default async function createRoom(req, res) {
    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');
    const users = client.db('cs495').collection('users');

    if (req.method === 'POST') {
        let room = await req.body;

        const id = new ObjectId().toString();
        room._id = Buffer.from(id, 'hex').toString('base64url');
        const existing_room = await rooms.findOne({name: room.name});
        if(existing_room){
            return res.status(httpStatus.FORBIDDEN).end();
        }

        rooms.insertOne(room);

        users.updateOne(
            { email: room.owner },
            { $push: { rooms: room._id } }
        );

        // Sungmin says: this for loop may cause the request to timeout
        // when there are many members (the timeout period for the free Vercel
        // license is very short). I modified the for loop to prevent this
        // from happening, but I haven't tested it yet.
        for (let member of room.members) {
            const email = member;
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
                        polls: [],
                        registered: false,
                    });
                }
            })
        }
        
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
};