import httpStatus from 'http-status';
import clientPromise from '@/lib/mongodb';
import dailyCode from '@/lib/dailyCode';

/**
 * Verifies that the given attendance code is valid.
 */
export default async function Verify(req, res) {
    const { roomId, date, code } = req.query;

    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');

    if (code === dailyCode(roomId, date)) {
        res.send('valid');
    } else {
        res.send('invalid');
    }

    return res.status(httpStatus.OK).end();
}