import clientPromise from '@/lib/mongodb'
import httpStatus from 'http-status'
import useSWR from 'swr'
import { usePusher } from '@/lib/PusherContext'
import { fetchText, fetchJSON } from '@/lib/fetch';
import { useState, useEffect, useContext } from 'react'
import { RoomContext } from '@/lib/roomContext'
var ObjectId = require('mongodb').ObjectId;

/**
 * Inserts a new room into the database.
 * FIXME: adding a large number of members to a room may
 * cause the request to timeout.
 */
export default async function createPoll(req, res) {
    const client = await clientPromise;
    const rooms = client.db('cs495').collection('rooms');
    const users = client.db('cs495').collection('users');
    const polls = client.db('cs495').collection('poll');

    if (req.method === 'POST') {
        let poll = await req.body;
        

        const id = new ObjectId().toString();
        //add poll to room, given poll owner 

        poll._id = Buffer.from(id, 'hex').toString('base64url');
        //? Don't need to find already existing poll 
        //how to just remove already existing one and 
        const existing_poll = await polls.findOne({name: poll.name});
        
        if(existing_poll){
            return res.status(httpStatus.FORBIDDEN).end();
        }

        polls.insertOne(poll);

        users.updateOne(
            { email: poll.owner },
            { $push: { polls: poll._id } }
        );
  
        let x=0;
        // Add members of room to poll 
        //poll has room id and room id used to find members to add 
        //add poll to users
        const cursor = rooms.find({ $and: [{ 'members': { $exists: true }},{ '_id':poll.roomPoll}]});
            await cursor.forEach(room => {
                room.members.forEach(email => {
                    polls.updateOne(
                        { _id: poll._id },
                        { $push: { voters: email}}
                    );
                    if(x==0){
                    rooms.updateOne(
                        { _id: room._id },
                        { $push: { polls: poll._id}}
                    );
                    users.updateOne(
                        { email: email },
                        { $push: { polls: poll._id}}
                    );
                    console.log(email); 
                    }
                    x=x+1;
                console.log(email); 
                });
                }
        );
        return res.status(httpStatus.OK).end();
    }

    return res.status(httpStatus.BAD_REQUEST).end();
};