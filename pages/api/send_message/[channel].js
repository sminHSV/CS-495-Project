import Pusher from "pusher"

const channels = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.KEY,
    secret: process.env.SECRET,
    cluster: 'us2',
});

export default async function handler(req, res) {
    const { message, sender } = req.body;
    const { channel } = req.query;

    channels.trigger(channel, 'message-sent', {
        message,
        sender
    }
    ).then(() => res.status(200).end()
    ).catch(() => res.status(400).end());
}