import { withSessionRoute } from 'lib/withSession';
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

/**
 * Sends every quiz the room is apart of 
 */
export default withSessionRoute(async (req, res) => {
    const user = req.session.user;

    const client = await clientPromise;
    const users = await client.db('cs495').collection('users');
    const rooms = await client.db('cs495').collection('rooms');
    const polls = await client.db('cs495').collection('poll');
    //  code queries a MongoDB database for a user's rooms based on their email 
    // address and returns an array of room IDs associated with that user's email.
    const { polls: poll_ids } = await users.findOne(
        { email: user.email },
        { _id: 0, polls: 1}
    );

    const cursor = await polls.find(
        { _id: { $in: poll_ids }}
    )

    res.send(await cursor.toArray());
    return res.status(httpStatus.OK).end();
});