import { withSessionRoute } from 'lib/withSession';
import httpStatus from 'http-status';

/**
 * Create a new Guest session.
 */
export default withSessionRoute(async (req, res) => {
    if (req.method === "POST") {
        const { name } = req.body;

        req.session.user = { email: '', name: name , guest: true, polls:[]};
        await req.session.save();
        return res.status(httpStatus.OK).send("");
    }
});