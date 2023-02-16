import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute((req, res, session) => {
    req.session.destroy();
    res.redirect('/login');
}, {
    cookieName: process.env.SITE_COOKIE,
    password: process.env.APPLICATION_SECRET,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});