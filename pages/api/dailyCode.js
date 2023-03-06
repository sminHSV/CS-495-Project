import httpStatus from 'http-status';
const seedrandom = require('seedrandom');

export default async function DailyCode(req, res) {
    const { roomId } = req.query;

    const rng = seedrandom(roomId + new Date(Date.now()).toDateString());
    res.send(Math.floor(rng() * 1000000).toString().padStart(6, "0"));
    return res.status(httpStatus.OK).end();
}