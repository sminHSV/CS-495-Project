import clientPromise from './mongodb';

const seedrandom = require('seedrandom');

/**
 * Returns the daily attendance code for the given room. 
 * The code is different for each day.
 * DO NOT USE IN CLIENT-SIDE CODE!
 * @param {*} roomId 
 * @returns a six-digit string
 */
export default async function dailyCode(roomId, date) {
    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');
    const { timezone } = await rooms.findOne(
        { _id: roomId },
        { _id: 0, timezone: 1}
    );

    const rng = seedrandom(
        roomId 
        + date
        + process.env.APP_PASSWORD
    );

    console.log(Math.floor(rng() * 1000000).toString().padStart(6, "0"));
    
    return Math.floor(rng() * 1000000).toString().padStart(6, "0");
}