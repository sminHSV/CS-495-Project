const seedrandom = require('seedrandom');

export default function dailyCode(roomId) {
    const rng = seedrandom(roomId + new Date(Date.now()).toDateString() + process.env.APP_PASSWORD);
    
    return Math.floor(rng() * 1000000).toString().padStart(6, "0");
}