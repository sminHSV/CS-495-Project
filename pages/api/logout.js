import { withSessionRoute } from 'lib/withSession';

export default withSessionRoute((req, res, session) => {
    req.session.destroy();
    res.redirect('/');
});