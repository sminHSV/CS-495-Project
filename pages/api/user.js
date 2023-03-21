import { withSessionRoute } from 'lib/withSession';

/**
 * Send the current user session.
 */
export default withSessionRoute((req, res) => {
    res.send(req.session.user);
});