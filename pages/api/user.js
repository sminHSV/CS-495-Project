import { withSessionRoute } from 'lib/withSession';

export default withSessionRoute((req, res) => {
    res.send(req.session.user);
});