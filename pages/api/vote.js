import Pusher from "pusher"
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

const channels = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: 'us2',
});

export default async function Vote(req, res) {
    const { roomId, pollId } = req.query;
    const channel = Buffer.from(roomId, 'base64url').toString('hex');

    const client = await clientPromise;
    const polls = client.db('cs495').collection('poll');

    if (req.method === 'POST') {
        const vote = await req.body;

        const response = await polls.updateOne(
            { _id: pollId },
            { $push: { voters: vote }}
        );

        if (!response.acknowledged) {
            return res.status(httpStatus.NOT_MODIFIED).end();
        }
        await channels.trigger(channel, 'vote', vote);
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
}