import { withSessionRoute } from 'lib/withSession';
import httpStatus from 'http-status';
import clientPromise from '@/lib/mongodb';


export default withSessionRoute(async (req, res) => {
    const client = await clientPromise;

    try {
        const rooms = client.db("cs495").collection("rooms");

        if(req.method == 'GET'){
            const name = await req.query.name;
            const room = await rooms.findOne({ name: name});
            if (room) {
                if(room.visability == 'private'){
                    return res.status(httpStatus.NOT_FOUND).send(JSON.stringify({id : -1}));
                }
                else{
                    return res.status(httpStatus.OK).send(JSON.stringify({id : room._id}));
                }
            } else {
                return res.status(httpStatus.NOT_FOUND).end();
            }
        }
        return res.status(httpStatus.BAD_REQUEST).end();
    }catch (error) {
        console.log(error, error.message);
        return res.status(httpStatus.BAD_REQUEST).end();
    }

});