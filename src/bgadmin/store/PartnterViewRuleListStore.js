import React from 'react'
import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
import ActionButton from "antd/lib/modal/ActionButton"
import produce from "immer"
import { ModelAction } from "../../app/mq/ModelAction"
import {Button} from '../../ui'
import { push } from 'connected-react-router'
import { ModalSheetManager } from '../../app/modelView/ModalSheetManager'
export default class PartnerViewRuleListStore extends AppModelViewStore{
    constructor(){
        super("admin","partnerViewRuleApi","list")
        this.columns=[
            {
                title:"标识",
                dataIndex:"id",
                key:"id"
            }
            ,
            {
                title:"角色名称",
                dataIndex:"roleName",
                key:"roleName"
            }
            ,
            {
                title:"App",
                dataIndex:"app",
                key:"app"
            }
            ,
            {
                title:"Model",
                dataIndex:"model",
                key:"model"
            },
            {
                title:"操作",
                dataIndex:"x",
                key:"x",
                render:(id,r)=>{
                    return <Button onClick={()=>{
                        this.gotoEdit(r.id)
                    }}>编辑</Button>
                }
            }
        ]
    }

    onSizeChange(view,pageSize){
        this.put({
            type:"pageSize",
            data:pageSize
        })
    }
    reloadCorpRule(view){
        this.put({
            type:"reloadCorpRule"
        })
    }
    gotoEdit(id){
        this.dispatch(push("/app/dynamic/admin/partnerViewRuleApi/edit",{id}))
    }

    didMount(view){
        this.put({
            type:"loadPartnerViewRulePage",
            data:{
                pageSize:view.props.pageSize||10,
                pageIndex:1
            }
        })
    }


    getPageInfo(view){
        const rows = (view.props.pageData||{}).rows||[]
        const totalCount = (view.props.pageData||{}).totalCount||0
        const pageIndex = (view.props.loadPartnerViewRulePage||{}).pageIndex||1
        const pageSize = view.props.pageSize||10
        return {rows,totalCount,pageIndex,pageSize,columns:this.columns}
    }

    onCurrentChange(view,pageIndex){
        this.put({
            type:"loadPartnerViewRulePage",
            data:{
                pageSize:view.props.pageSize||10,
                pageIndex:pageIndex
            }
        })
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
            case "reloadCorpRule":
                yield* new ModelAction("admin","partnerRuleApi").genCall("reloadRule",{})
                ModalSheetManager.alert({
                    title:"提示",
                    msg:"重载成功"
                })
                return 1
            default:
                return 1
        }
    }
}