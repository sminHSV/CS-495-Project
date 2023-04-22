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
            //owner is deleting room
            if(result.owner == user.email){
                rooms.deleteOne({_id: room});
                //remove room from all members list
                for( var x of result.members){
                    const u = await users.findOne({email: x});
                    var newRooms = u.rooms;
                    const index = newRooms.indexOf(room);
                    if (index > -1) { 
                        newRooms.splice(index, 1); 
                    }
                    await users.updateOne({_id: user._id}, { $set: { rooms: newRooms } }) 
                }
            }

            //user is removing room from their list 
            else{
                const u = await users.findOne({email: user.email});
                var newRooms = u.rooms;
                const index = newRooms.indexOf(room);
                if (index > -1) { 
                    newRooms.splice(index, 1); 
                }
                await users.updateOne({email: user.email}, { $set: { rooms: newRooms } })
            }
            return res.status(httpStatus.OK).end();
        }
        else{
            return res.status(httpStatus.NOT_FOUND).end();
        }
    }
        
});