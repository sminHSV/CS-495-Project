import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import clientPromise from 'lib/mongodb';
import { withSessionRoute } from 'lib/withSession';

export default withSessionRoute(async (req, res) => {
  const { name, email, password } = await req.body;
  const client = await clientPromise;
  try {
    const users = client.db("cs495").collection("users");

    if (req.method === 'POST') {
      const userCheck = await users.findOne({ email: email.toLowerCase() });
      if (userCheck) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'User already exists' });
      }
      // create user
      const hashPassword = await bcrypt.hash(password.toLowerCase(), 10);
      const user = await users.insertOne({
        name,
        email,
        password: hashPassword,
        rooms: [],
      });

      return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
    
  } catch (error) {
    console.log(error, error.message);
    res.status(fetchResponse?.status || 500).json(error.message);
  }
});