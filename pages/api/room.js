import { withSessionRoute } from 'lib/withSession';
import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'

/**
 * Send the specified room's info.
 */
export default withSessionRoute(async (req, res) => {

    if (req.method === 'GET') {
        const user = req.session.user;
        const { roomId }  = req.query;
    
        const client = await clientPromise;
        const rooms = await client.db('cs495').collection('rooms');
        
        const result = await rooms.findOne(
            { _id: roomId },
            { _id: 1, name: 1, owner: 1, schedule: 1 }
        );
    
        if (result) {
            res.send(result);
            return res.status(httpStatus.OK).end();
        } else {
            return res.status(httpStatus.NOT_FOUND).end();
        }
    }
    else if(req.method === 'DELETE'){
        const client = await clientPromise;
        const rooms = await client.db('cs495').collection('rooms');
        const users = await client.db('cs495').collection('users');
        const { room, user } = req.body;
        const result = await rooms.findOne({_id: room});
        if(result){
            if(result.owner == user.email){
                rooms.deleteOne({_id: room});
                for( var x of result.members){
                    
                    await users.updateOne({_id: user._id}, { $set: { rooms: newRooms } }) 
                }
            }
            else{
                var newRooms = user.rooms;
                const index = newRooms.indexOf(5);
                if (index > -1) { 
                    newRooms.splice(index, 1); 
                }
                await users.updateOne({_id: user._id}, { $set: { rooms: newRooms } })
            }
            return res.status(httpStatus.OK).end();
        }
        else{
            return res.status(httpStatus.NOT_FOUND).end();
        }
    }
        
});