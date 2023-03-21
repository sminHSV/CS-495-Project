import { withSessionRoute } from 'lib/withSession';
import httpStatus from 'http-status';
import clientPromise from '@/lib/mongodb';
import bcrypt from "bcryptjs";

/**
 * Create a new user session.
 */
export default withSessionRoute(async (req, res) => {
    if (req.method === "POST") {
        const { email, password } = await req.body;

        const client = await clientPromise;
        const users = client.db("cs495").collection("users");
        const user = await users.findOne(
            { email: email.toLowerCase() },
            { _id: 0, email: 1, name: 1, registered: 1 }
        );

        if (!user || !user.registered) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'User does not exist'})
        }

        const valid = await bcrypt.compare(password, user.password);

        if (valid === true) {
            req.session.user = { ...user, guest: false };
            await req.session.save();
            return res.status(httpStatus.OK).end();
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Inavlid Password'});
        }
    }
});