import { withIronSessionApiRoute } from "iron-session/next";
import httpStatus from 'http-status';
import clientPromise from 'lib/mongodb';
import bcrypt from "bcryptjs";

export default withIronSessionApiRoute(async (req, res) => {
    if (req.method === "POST") {
        const { email, password } = req.body;

        const client = await clientPromise;
        const users = client.db("cs495").collection("users");
        const user = await users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'User does not exist'})
        }

        const valid = await bcrypt.compare(password, user.password);

        if (valid === true) {
            req.session.user = { id: user._id, email: user.email, name: user.name };
            await req.session.save();
            return res.status(httpStatus.OK).send("");
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Inavlid Password'});
        }
    }
}, {
    cookieName: process.env.SITE_COOKIE,
    password: process.env.APPLICATION_SECRET,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
});