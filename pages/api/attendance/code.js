import httpStatus from 'http-status';
import dailyCode from '@/lib/dailyCode';

export default async function Code(req, res) {
    const { roomId } = req.query;

    res.send(dailyCode(roomId));
    return res.status(httpStatus.OK).end();
}