import { withSessionRoute } from 'lib/withSession';
import httpStatus from 'http-status';
import clientPromise from 'lib/mongodb';

export default withSessionRoute(async (req, res) => {
    if (req.method === "POST") {
        const { name } = req.body;

        req.session.user = { id: null, email: null, name: name };
        await req.session.save();
        return res.status(httpStatus.OK).send("");
    }
});