import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute((req, res) => {
    res.send({ user: req.session.user });
}, {
    cookieName: env.process.SITE_COOKIE,
    password: env.process.APPLICATION_SECRET,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});