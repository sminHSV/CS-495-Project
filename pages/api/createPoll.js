import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

var ObjectId = require('mongodb').ObjectId;

/**
 * Inserts a new room into the database.
 * FIXME: adding a large number of members to a room may
 * cause the request to timeout.
 */
export default async function createPoll(req, res) {
    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');
    const users = client.db('cs495').collection('users');
    const polls = client.db('cs495').collection('poll');
   
    if (req.method === 'POST') {
        let poll = await req.body;

        const id = new ObjectId().toString();
        poll._id = Buffer.from(id, 'hex').toString('base64url');
        //? Don't need to find already existing poll 
        //how to just remove already existing one and 
        const existing_poll = await polls.findOne({name: poll.name});
        
        if(existing_poll){
            return res.status(httpStatus.FORBIDDEN).end();
        }

        polls.insertOne(poll);

        users.updateOne(
            { email: poll.owner },
            { $push: { polls: poll._id } }
        );

        // Sungmin says: this for loop may cause the request to timeout
        // when there are many members (the timeout period for the free Vercel
        // license is very short). I modified the for loop to prevent this
        // from happening, but I haven't tested it yet.
        // Update options if given
        //entering members to room, adding members to room 
        //adding options to polls 
        // **opt
        //adding option
        for (let member of rooms.members) {
            const email = member.email;
            users.updateOne(
                { email: email }, 
                { $push: {polls: polls._id }}
            ).then(res => {
                if (res.matchedCount === 0) {
                    users.insertOne({ 
                        email: email, 
                        password: '', 
                        name: 'anonymous', 
                        rooms: [room._id],
                        polls: [poll._id],
                        registered: false,
                    });
                }
            })
        }
        
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
};