import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import clientPromise from 'lib/mongodb';
import { withSessionRoute } from 'lib/withSession';
import { nanoid } from "nanoid"

export default withSessionRoute(async (req, res) => {
   
    const client = await clientPromise;
    const nodemailer = require("nodemailer");

    try {
        const users = client.db("cs495").collection("users");

        if(req.method == 'GET'){
            const email = await req.query.email;
            const userCheck = await users.findOne({ email: email.toLowerCase() });
            if (!userCheck) {
                return res.status(httpStatus.BAD_REQUEST).json({ message: 'User with that email does not exist' });
            }
            let testAccount = await nodemailer.createTestAccount();

            
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                user: testAccount.user, 
                pass: testAccount.pass, 
                },
            });

            const tokenId = nanoid(32);

            await client.db('cs495').collection("tokens").insertOne({
              _id: tokenId,
              creatorId: user._id,
              type: "passwordReset",
              expireAt: new Date(Date.now() + 20 * 60 * 1000), //20 mins 
            });

            // db.collection("tokens").createIndex("expireAt", { expireAfterSeconds: 0 });

            const link = `${process.env.WEB_URI}password-reset-form/${tokenId}/${email}`;
            let info = await transporter.sendMail({
                from: '"Andrew Testing" <andrew@testing.com>', // sender address
                to: email, 
                subject: "Password reset", // Subject line
                html: "<b>Please click the link below to reset your password</b><b>"+link +"</b>", // html body
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return res.status(httpStatus.OK).end();
        }
        
        else if(req.method == 'PUT'){
            const { token, password } = req.body;
            async (req, res) => {
                const deletedToken = await db
                  .collection("tokens")
                  .findOneAndDelete({ _id: id, type });
            
                if (!deletedToken) {
                  res.status(403).end();
                  return;
                }
            
                const password = await bcrypt.hash(password.toLowerCase(), 10);
                await client.db('cs495').collection("tokens").updateOne({ _id: deletedToken.creatorId }, { $set: { password } });

                return res.status(httpStatus.OK).end();
            }
        }

        return res.status(httpStatus.BAD_REQUEST).end();

    } catch (error) {
        console.log(error, error.message);
        res.status(fetchResponse?.status || 500).json(error.message);
    }
});