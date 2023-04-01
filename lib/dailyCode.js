const seedrandom = require('seedrandom');

/**
 * Returns the daily attendance code for the given room. 
 * The code is different for each day.
 * DO NOT USE IN CLIENT-SIDE CODE!
 * @param {*} roomId 
 * @returns a six-digit string
 */
export default function dailyCode(roomId) {
    const rng = seedrandom(roomId + new Date(Date.now()).toDateString() + process.env.APP_PASSWORD);
    
    return Math.floor(rng() * 1000000).toString().padStart(6, "0");
}