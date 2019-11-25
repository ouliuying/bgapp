import React from 'react'
import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
import ActionButton from "antd/lib/modal/ActionButton"
import produce from "immer"
import { ModelAction } from "../../app/mq/ModelAction"
import {Button} from '../../ui'
import { push } from 'connected-react-router'
export default class PartnerViewRuleListStore extends AppModelViewStore{
    constructor(){
        super("admin","partnerViewRuleApi","list")
    }

    reducer(state,action){
        console.log(action.type+" reducer")
        switch(action.type){
            default:
                return produce(state||{},draft=>{
                    draft[action.type]=action.data
                })
        }
    }

    *effect(state,action){
        console.log("effect " +action.type)
        switch(action.type){
            case "loadPartnerViewRulePage":
                let pageInfo = yield* new ModelAction("admin","partnerViewRuleApi").genCall("loadPartnerViewRulePage",{
                   ...action.data
                })
                if(pageInfo.errorCode==0){
                    this.put({
                        type:"pageData",
                        data:pageInfo.bag
                    })
                }
                return 1
            default:
                return 1
        }
    }

}