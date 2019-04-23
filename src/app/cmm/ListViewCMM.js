import React from "react"
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
    setListContextCriteria,
    setListContextData,
    removeListContextViewData
} from '../actions/appContext'
import { goBack,push } from 'connected-react-router';
import produce from "immer"
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import {CREATE_VIEW_DATA, RECORD_TAG,ARGS} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper'
import {viewDataFromListContext} from '../reducers/appContext'
import {Button,Form,Tabs,Table, MessageBox} from 'element-react'

import { and } from '../../criteria';

export class ListViewCMM extends  ViewCMM{
    constructor(app,model,viewType){
        super(app,model,viewType)
    }

    static get s_viewType(){
        return "list"
    }

    mapTo(state, ownProps){
        let baseProps= super.mapTo(state, ownProps);
        const {appModelViewType,ownerField} = ownProps
        let installApps=getAppsSelector(state)
        const {app,model,viewType}=appModelViewType
        let viewData=viewDataFromListContext(state)({app,model,viewType,ownerField})
        let newProps= Object.assign({},installApps,{viewData})
         return Object.assign({},baseProps,newProps,ownProps);
      }


    init(view){
   
    }

    update(view){
       
            
    }
    // const {columns,rows,currentPage,totalCount,pageSize} = self.cmmHost.getViewDatas(self,viewData)
    getViewDatas(view,viewData){
        let self =this
        let {pageData,data,totalCount,view:viewMeta,triggerGroups} = viewData
        const {app,model}=view
        let pageSize = pageData && pageData.pageSize||10
        let currentPage =  pageData && pageData.pageIndex||1
        totalCount = totalCount||0
        let columns = []
        let rows = []
        for(let d of ((data||{}).record||[])){
            rows.push(d)
        }
        for(let f of ((viewMeta||{}).fields||[])){
            if(!f.relationData){
                columns.push({
                    label:f.title,
                    prop:f.name
                    })
            }
            else{
                columns.push({
                    label:f.title,
                    prop:f.name,
                    render:(row, column, index)=>{
                        console.log(`${JSON.stringify(row)}.${JSON.stringify(column)}.${index}`)
                        let d =row[column.prop]
                        if(d instanceof Object && d.record){
                            if(d.record instanceof Array){
                                return (d.record[0]||{})[f.relationData.toName]
                            }
                            else{
                                return d.record[f.relationData.toName]
                            }
                        }
                        else{
                            return ""
                        }
                    }
                })
            }
           
        }
     
        columns.push({
            label: "操作",
            width: 120,
            render: (row, column, index)=>{
                let tg= triggerGroups.find(x=>x.name=="opAction")
                let selActionTg = triggerGroups.find(x=>x.name=="selAction")
                return <span>
                    {
                        tg && tg.triggers.map(t=>{
                            return <Button type="text" size="small" onClick={()=>{
                                produce(t,draft=>{
                                    if(!draft.app || draft.app=="*"){
                                        draft.app = self.app
                                    }
                                    if(!draft.model || draft.model=="*"){
                                        draft.model = self.model
                                    }
                                    draft[ARGS]={id:row["id"],tag:row[RECORD_TAG]}
                                    self.doAction(view,draft)
                                })
                               
                            }}>{t.title}</Button>
                        })
                    }
                    {
                        selActionTg && selActionTg.triggers.map(t=>{
                            return <Button type="text" size="small" onClick={()=>{
                                produce(t,draft=>{
                                    if(!draft.app || draft.app=="*"){
                                        draft.app = self.app
                                    }
                                    if(!draft.model || draft.model=="*"){
                                        draft.model = self.model
                                    }
                                    draft[ARGS]={id:row[index]["id"],tag:row[index][RECORD_TAG],data:row}
                                    self.doAction(view,draft)
                                })
                               
                            }}>{t.title}</Button>
                        })
                    }
                </span>
            }
        })
     
        return {columns,rows,currentPage,totalCount,pageSize}

    }
    getCriteria(viewData){
        const {criterias} = viewData
        if(criterias){
            let expArr=[]
            Object.keys(criterias).map(key=>{
                let v = criterias[key]
                expArr.push(v.expression)
            })
            if(expArr.length>0){
                return and(...expArr)
            }
        }
    }
    didMount(view){
        let {ownerField,viewData,viewRefType}= view.props
        const {pageData} = viewData
        let criteria = this.getCriteria(viewData)
        if(viewData && viewData.view){
            return
        }
        var reqParam={
            viewType:this.viewType,
            viewRefType:viewRefType,
            ownerField:ownerField&&{
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name
            },
            reqData:{
                app:this.app,
                model:this.model,
                criteria,
                pageIndex:(pageData&&pageData.pageIndex)||1,
                pageSize:(pageData&&pageData.pageSize)||10,
            }
        }
        var self=this
        new ModelAction(this.app,this.model).call("loadModelViewType",reqParam,function(data){
        data.bag && setListContextData(
            self.app,
            self.model,
            self.viewType,
            data.bag,
            ownerField,
        )
        },function(err){
            console.log(err)
        })
    }

    onCriteriaValueChange(data){
        let self=this
        setListContextCriteria(self.app,self.model,self.viewType,data.name,data)
    }

 

    doAction(view,trigger){
        if(this[trigger.name]){
            this[trigger.name].call(this,view,trigger)
        }
    }
    search(view){
        
    }

    onSizeChange(view,size){
        
    }
    onCurrentChange(view,currentPage){
      
    }
    toDetail(view,trigger){
        let routerPath = getRoutePath(trigger.app,trigger.model,trigger.viewType)
        let arg = trigger[ARGS]
        let id = arg.id
        goRoute(routerPath+"/"+arg.id,{modelID:id})
    }
    doDelete(view,trigger){
        let arg = trigger[ARGS]
        let {id,tag}=arg
        let self=this
        const {ownerField,__inner_store__:innerStore}=view.props

        new ModelAction(this.app,this.model).call("delete",{
            id
        },function(res){
        if(res.errorCode==0){
           //(app,model,viewType,tags,ownerField)
            removeListContextViewData(self.app,self.model,self.viewType,[tag],ownerField)
        }
        else{
            MessageBox.alert(res.description)
        }
        },function(err){
            MessageBox.alert("通讯失败！")
        })
    }
    toAdd(view){
        var path=getRoutePath(this.app,this.model,"create")
        view.props.dispatch(push(path))
    }
    doSelSingleItem(view,trigger){
        let arg = trigger[ARGS]
        
    }
}