import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import clientPromise from 'lib/mongodb';
import { withSessionRoute } from 'lib/withSession';

export default withSessionRoute(async (req, res) => {
  const { name, email, password } = await req.body;
  const client = await clientPromise;
  try {
    const users = client.db("cs495").collection("users");

    if (req.method === 'PUT') {
      const user = await users.findOne(
        { email: email.toLowerCase() },
        { _id: 0, registered: 1 }
      );
      if (user && user.registered) {
        return res.status(httpStatus.OK).json({ message: 'User already exists' });
      }
      // create/update user
      const hashPassword = await bcrypt.hash(password.toLowerCase(), 10);

      if (user) {
        await users.updateOne(
          { email: email.toLowerCase() },
          { $set: { name: name, password: hashPassword }}
        );
      } else {
        await users.insertOne({
          name,
          email,
          password: hashPassword,
          rooms: [],
          registered: true,
        });
      }
      
      return res.status(httpStatus.CREATED).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
    
  } catch (error) {
    console.log(error, error.message);
    res.status(fetchResponse?.status || 500).json(error.message);
  }
});