import { withSessionRoute } from 'lib/withSession';
import httpStatus from 'http-status';

export default withSessionRoute(async (req, res) => {
    if (req.method === "POST") {
        const { name } = req.body;

        req.session.user = { email: '', name: name , guest: true};
        await req.session.save();
        return res.status(httpStatus.OK).send("");
    }
});