import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'
import bcrypt from "bcryptjs";

export default async function getUsers(req, res) {
    const client = await clientPromise;
    const users = await client.db('cs495').collection('users');

    if (req.method == 'PUT') {
        const { emails } = await req.body;
        const userArray = [];

        for (let email of emails) {
            const result = await users.findOne(
                { email: email.toLowerCase() }, { name: 1, email: 1}
            );
            if (result) {
                userArray.push(result);
            } else {
                const hash = await bcrypt.hash(process.env.APP_PASSWORD, 10); // Is this safe?... Eh, good enough.
                
                await users.insertOne({ 
                    email, 
                    password: hash, 
                    name: 'anonymous', 
                    rooms: [] 
                });
            }
        }

        res.send(userArray);
        return res.status(httpStatus.OK).end();
    }
}