import MessageForm from "./messageForm"
import { RoomContext } from '@/lib/roomContext'

export default function MessageThread({ message }) {

    async function sendReply(message) {

    }

    return (<>
        

        <MessageForm onSubmit={sendReply} prompt='Write a response...'/>

        <style jsx>{`
            
        `}</style>
    </>)
}