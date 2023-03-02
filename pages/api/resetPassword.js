import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import clientPromise from 'lib/mongodb';
import { withSessionRoute } from 'lib/withSession';

export default withSessionRoute(async (req, res) => {
    const email = await req.query.email;
    const client = await clientPromise;
    const nodemailer = require("nodemailer");
    
    try {
        const users = client.db("cs495").collection("users");

        if(req.method == 'GET'){
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

            
            let info = await transporter.sendMail({
                from: '"Andrew Testing" <andrew@testing.com>', // sender address
                to: email, 
                subject: "Password reset", // Subject line
                html: "<b>Please click the link below to reset your password</b>", // html body
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return res.status(httpStatus.OK).end();
        }
    
        return res.status(httpStatus.BAD_REQUEST).end();

    } catch (error) {
        console.log(error, error.message);
        res.status(fetchResponse?.status || 500).json(error.message);
    }
});