import { withSessionRoute } from 'lib/withSession';
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'
var ObjectId = require('mongodb').ObjectId;

export default withSessionRoute(async (req, res) => {

    if (req.method === 'GET') {
        const user = req.session.user;
        const { roomId }  = req.query;
    
        const client = await clientPromise;
        const rooms = await client.db('cs495').collection('rooms');
    
        const result = await rooms.findOne(
            { _id: roomId },
            { _id: 1, name: 1, owner: 1, schedule: 1 }
        );
    
        if (result) {
            res.send(result);
            return res.status(httpStatus.OK).end();
        } else {
            return res.status(httpStatus.NOT_FOUND).end();
        }
    }

    return res.status(httpStatus.BAD_REQUEST);
});