import { withSessionRoute } from 'lib/withSession';

/**
 * Destroy the old user session.
 */
export default withSessionRoute((req, res, session) => {
    req.session.destroy();
    res.redirect('/');
});