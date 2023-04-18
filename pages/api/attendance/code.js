import httpStatus from 'http-status';
import dailyCode from '@/lib/dailyCode';

/**
 * Sends the daily attendance code for use on the client side.
 * The attendance code should only be shared with room admins.
 */
export default async function Code(req, res) {
    const { roomId, date } = req.query;

    res.send(await dailyCode(roomId, date));
    return res.status(httpStatus.OK).end();
}