import { SEND_MESSAGE_TO_SERVER_TOPIC } from "./core/Chat";
import { MessageBus } from "../mb/MessageBus";
let msgSeq=10
export class MessagApi{
    static send(msg){
        msg.seq = msgSeq
        msgSeq++
        MessageBus.ref.send(SEND_MESSAGE_TO_SERVER_TOPIC,msg)
    }
    static isUUIDResponse(msg){
        return msg && msg.isResponse==1 && msg.type==0
    }
}