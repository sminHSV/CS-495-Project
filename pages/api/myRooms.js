import { withSessionRoute } from 'lib/withSession';
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

export default withSessionRoute(async (req, res, session) => {
    const user = req.session.user;

    const client = await clientPromise;
    const rooms = await client.db('cs495').collection('rooms');

    const result = await rooms.find(
        { _id: { $in: user.rooms } },
        { _id: 1, name: 1}
    );

    const myRooms = await result.toArray();

    res.send(myRooms);
    return res.status(httpStatus.OK).end();
});