import {
    SET_PARTNER,
    SET_PARTNER_USERNAME_PASSWORD,

} from '../actions/partner'
import { createSelector } from 'reselect'
import {ChatCore} from '../bgchat/core/Chat'
const initPartner={
    userName:'',
    password:'',
    status:0,
    devType:0,
    chatUUID:"",
    errorDescription:""
}
export function partner(state,action){
    if(typeof state == "undefined"){
        return initPartner
    }
    switch(action.type){
        case SET_PARTNER:
        {
            let newState=action.payload
            if(newState.errorCode===0){
                return Object.assign({},state,newState.bag.partner)
            }
            else{
                return Object.assign({},state,
                    {errorDescription:newState.description,status:0})
            }
            
        }
       
        case SET_PARTNER_USERNAME_PASSWORD:
        {
            let newState=action.payload
            return  Object.assign({},state,newState)
        }
        default:
           return state
    }
}


//reselect

export const userNamePasswordSelector=createSelector(state=>state.partner.userName,
    state=>state.partner.password,
    (userName,password)=>({userName,password}))


export const statusSelector=state=>({status:state.partner.status,errorDescription:state.partner.errorDescription})
export const getCurrPartner=createSelector(state=>state.partner,partner=>(partner))