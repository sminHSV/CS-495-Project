import { withSessionRoute } from 'lib/withSession';
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

export default withSessionRoute(async (req, res) => {
    const user = req.session.user;

    const client = await clientPromise;
    const users = await client.db('cs495').collection('users');
    const rooms = await client.db('cs495').collection('rooms');

    const { rooms: room_ids } = await users.findOne(
        { email: user.email },
        { _id: 0, rooms: 1}
    );

    const cursor = await rooms.find(
        { _id: { $in: room_ids }},
        { _id: 1, name: 1, owner: 1 }
    )

    res.send(await cursor.toArray());
    return res.status(httpStatus.OK).end();
});