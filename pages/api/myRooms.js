import { withSessionRoute } from 'lib/withSession';
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

export default withSessionRoute(async (req, res) => {
    const user = req.session.user;

    const client = await clientPromise;
    const users = await client.db('cs495').collection('users');

    const result = await users.findOne(
        { email: user.email },
        { _id: 0, rooms: 1}
    );

    res.send(result.rooms);
    return res.status(httpStatus.OK).end();
});