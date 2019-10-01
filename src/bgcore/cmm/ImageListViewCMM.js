import React from 'react'
import { ListViewCMM } from '../../app/cmm/ListViewCMM';
import {Tree,Button } from '../../ui'
import { getIcon } from '../../svg';
import { ARGS, RECORD_TAG } from '../../app/ReservedKeyword';
import {produce} from 'immer'
import ViewFieldTypeRegistry from '../../app/modelView/ViewFieldTypeRegistry'
import { ModelAction } from '../../app/mq/ModelAction';
import { setListContextData } from '../../app/actions/appContext';
export class ImageListViewCMM extends ListViewCMM{

    getViewDatas(view,viewData){
        let self =this
        let {data,totalCount,view:viewMeta,triggerGroups} = viewData
        let {localData} = view.props
        let {pageData} = localData||{}
        const {app,model}=view
        let pageSize = (pageData && pageData.pageSize)||10
        let currentPage = (pageData && pageData.pageIndex)||1
        totalCount = totalCount||0
        let columns = []
        let rows = []
        for(let d of ((data||{}).record||[])){
            rows.push(d)
        }
        for(let f of ((viewMeta||{}).fields||[])){
            if(!f.relationData){
                columns.push({
                    title:f.title,
                    dataIndex:f.name,
                    key:f.name,
                    render:(value)=>{
                        const FieldComponent=ViewFieldTypeRegistry.getComponent(f.type)
                        if(FieldComponent){
                            return <FieldComponent 
                            value={value}
                            meta={f.meta} 
                            enable={true} 
                            ctrlProps={f.ctrlProps}
                            title={f.title}
                            relationData={f.relationData}></FieldComponent>    
                        }
                        return value
                    }
                })
            }
            else{
                columns.push({
                    title:f.title,
                    key:f.name,
                    dataIndex:f.name,
                    render:(text,reocrd)=>{
                        let d =text
                        const FieldComponent=ViewFieldTypeRegistry.getComponent(f.type)
                        if(FieldComponent){
                            //return null
                            return <FieldComponent  value={d}  meta={f.meta} enable={true} ctrlProps={f.ctrlProps} title={f.title} relationData={f.relationData}></FieldComponent>    
                        }
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
            title: "操作",
            width: 120,
            render: (text,record)=>{
                let excludeGroups=["main","selSingleItemAction"]
                //let tg= triggerGroups.find(x=>x.name=="opAction")
                let selSingleItemActionTg = triggerGroups.find(x=>x.name=="selSingleItemAction")
                let tgs = triggerGroups.filter(x=>{
                    return excludeGroups.indexOf(x.name)<0
                })
                const {viewParam} = view.props
                const {external} = (viewParam||{})
                const requestName = external && external.getSingleSelectItem()
                let isSelected = requestName?self.isSameItem(requestName,record):false
                return <span>
                    {
                        tgs && tgs.map(tg=>{
                            return tg.triggers.map(t=>{
                                let IconCtrl =getIcon(t.icon)
                                return <Button type="text" size="small" onClick={()=>{
                                    produce(t,draft=>{
                                        if(!draft.app || draft.app=="*"){
                                            draft.app = self.app
                                        }
                                        if(!draft.model || draft.model=="*"){
                                            draft.model = self.model
                                        }
                                        draft[ARGS]={id:record["id"],tag:record[RECORD_TAG],data:record}
                                        self.doAction(view,draft)
                                    })
                                   
                                }} key={t.name}>{IconCtrl}{t.title}</Button>
                            })
                        })
                    }
                    {
                        selSingleItemActionTg && selSingleItemActionTg.triggers.map(t=>{
                            let IconCtrl =getIcon(t.icon)
                            return !isSelected?<Button type="text" size="small" onClick={()=>{

                                produce(t,draft=>{
                                    if(!draft.app || draft.app=="*"){
                                        draft.app = self.app
                                    }
                                    if(!draft.model || draft.model=="*"){
                                        draft.model = self.model
                                    }
                                    const {viewParam} = view.props
                                    const {external} = (viewParam||{})
                                    let requestName = record["storageEntity"].record["requestName"]
                                    external && external.setSingleSelectItem && external.setSingleSelectItem(requestName)
                                    external && external.close && external.close(view)
                                })
                               
                            }} key={t.name}>{IconCtrl}{t.title}</Button>:<span style={{color:"red"}}>当前设置</span>
                        })
                    }
                </span>
            }
        })
     
        return {columns,rows,currentPage,totalCount,pageSize}
    }

    isSameItem(requestName,item){
        return item["storageEntity"].record.requestName == requestName
    }

    fetchData(opts){
        const {view}=opts
        let {viewParam,viewData,viewRefType,localData}= view.props
        const {ownerField,ownerFieldValue,ownerModelID}=viewParam||{}
        const {pageData} = localData
        let pageIndex = (pageData&&pageData.pageIndex)||1
        let pageSize = (pageData&&pageData.pageSize)||10
        if(opts.pageIndex!=undefined){
            pageIndex = opts.pageIndex
        }
        if(opts.pageSize!=undefined){
            pageSize = opts.pageSize
        }
        let criteria = this.getCriteria(view)
        let rawOwnerFieldValue = this.getOwnerFieldRawFieldValue(this.app,this.model,ownerField,ownerFieldValue)
        var reqParam={
            viewType:this.viewType,
            viewRefType:viewRefType,
            ownerField:ownerField?{
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name,
                value:rawOwnerFieldValue,
            }:undefined,
            ownerModelID:ownerModelID?ownerModelID:undefined,
            reqData:{
                app:this.app,
                model:this.model,
                criteria,
                pageIndex:pageIndex,
                pageSize:pageSize,
            }
        }
        var self=this
        new ModelAction(this.app,this.model).call("loadModelViewType",reqParam,function(data){
        data.bag && setListContextData(
            self.app,
            self.model,
            self.viewType,
            self.initDatasource(data.bag,ownerField,ownerFieldValue),
            ownerField,
        )
        },function(err){
            console.log(err)
        })
    }

}