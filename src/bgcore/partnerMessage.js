import { MessageBus } from "../mb/MessageBus"
import { ModelAction } from "../app/mq/ModelAction"
import {logout} from '../actions/partner'
export const TOKEN_CHECK = "app:token_check"

function checkStatus(data){
    new ModelAction("core","partner").call("checkLogin",{},function(data){
        if(data.errorCode!=0){
            logout()
        }
    },function(data){

    })
}

MessageBus.ref.consume(TOKEN_CHECK,data=>{
    checkStatus(data)
})

