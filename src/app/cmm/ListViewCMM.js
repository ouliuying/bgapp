import React from "react"
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
    setListContextCriteria,
    setListContextData,
    removeListContextViewDataRecord,
    updateListContextViewDataRecord,
    setListOpSearchBoxVisible,
    setListOpSearchBoxCriteriaValue,
    setListCurrentPage,
    setListPageSize
} from '../actions/appContext'
import { goBack,push } from 'connected-react-router';
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import {CREATE_VIEW_DATA, RECORD_TAG,ARGS} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper'
import {viewDataFromListContext, localDataFromListContext} from '../reducers/appContext'
import {ModalSheetManager} from '../modelView/ModalSheetManager'
import {Button} from '../../ui'
import {createDetailParam,createViewParam} from '../modelView/ViewParam'
import { and } from '../../criteria'
import ViewType from "../modelView/ViewType"
import {produce} from 'immer'
import {bindRecordTag} from '../fieldHelper'
import {nextRecordTag} from '../../lib/tag-helper'
import {getExpression} from '../../lib/criteria-helper'
import { createCriteria } from "../modelView/ViewFieldCriteria";
export class ListViewCMM extends  ViewCMM{
    constructor(app,model,viewType){
        super(app,model,viewType)
    }

    static get s_viewType(){
        return ViewType.LIST
    }

    mapTo(state, ownProps){
        let baseProps= super.mapTo(state, ownProps);
        const {appModelViewType,viewParam} = ownProps
        const {ownerField} = (viewParam||{})
        let installApps=getAppsSelector(state)
        const {app,model,viewType}=appModelViewType
        let viewData=viewDataFromListContext(state)({app,model,viewType,ownerField})
        let localData=localDataFromListContext(state)({app,model,viewType,ownerField})
        let newProps= Object.assign({},installApps,{viewData},{localData})
        return Object.assign({},baseProps,newProps,ownProps)
    }


    init(view){
        
    }

    update(view){
       
            
    }
    // const {columns,rows,currentPage,totalCount,pageSize} = self.cmmHost.getViewDatas(self,viewData)
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
                    key:f.name
                    })
            }
            else{
                columns.push({
                    title:f.title,
                    key:f.name,
                    dataIndex:f.name,
                    render:(text,reocrd)=>{
                        let d =text
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
                let tg= triggerGroups.find(x=>x.name=="opAction")
                let selSingleItemActionTg = triggerGroups.find(x=>x.name=="selSingleItemAction")
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
                                    draft[ARGS]={id:record["id"],tag:record[RECORD_TAG]}
                                    self.doAction(view,draft)
                                })
                               
                            }} key={t.name}>{t.title}</Button>
                        })
                    }
                    {
                        selSingleItemActionTg && selSingleItemActionTg.triggers.map(t=>{
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
                                    const {external} = view.props
                                    external && external.close && external.close()
                                })
                               
                            }} key={t.name}>{t.title}</Button>
                        })
                    }
                </span>
            }
        })
     
        return {columns,rows,currentPage,totalCount,pageSize}

    }

    getCriteria(view){
        let expr=undefined
        const {viewData,localData}=view.props
        const {subViews}=viewData||{}
        const searchBox = (subViews||[]).find(x=>{
            return x.refView.viewType == "searchBox"
        })
        if(searchBox){
            let fields = (searchBox.view||{}).fields||[]
            let kvArr=[]
            fields.map(fd=>{
                let meta=fd.meta
                let skipValue = meta.skipValue||[]
                let v = this.getSearchBoxFieldValue(view,fd,localData)
                if(v!=undefined && skipValue.indexOf(v)<0){
                    kvArr.push({
                        name:fd.name,
                        value:v,
                        viweFieldType:fd.type
                    })
                }
            })
            let eArr=[]
            if(kvArr.length>0){
                for(let kv of kvArr){
                    let e=getExpression(kv.name,kv.value,kv.viweFieldType)
                    if(e){
                        eArr.push(e)
                    }
                }
            }
            if(eArr.length>0){
                expr=eArr.length==1?eArr[0]:and(...eArr)
            }
        }
        return expr
    }

    getOwnerFieldRawFieldValue(app,model,ownerField,ownerFieldValue){
        if(ownerField && ownerFieldValue!=null && ownerFieldValue!=undefined){
          if(ownerFieldValue instanceof Object){
             if(ownerFieldValue.record){
                 if(app==ownerField.relationData.targetApp && model==ownerField.relationData.targetModel){
                     return ownerFieldValue.record[ownerField.relationData.targetField]
                 }
                 else if(app == ownerField.relationData.relationApp && model == ownerField.relationApp.relationModel){
                  return ownerFieldValue.record[ownerField.relationData.relationField]
                 }
             }
             else{
                if(app==ownerField.relationData.targetApp && model==ownerField.relationData.targetModel){
                  return ownerFieldValue[ownerField.relationData.targetField]
                }
                else if(app == ownerField.relationData.relationApp && model == ownerField.relationApp.relationModel){
                return ownerFieldValue[ownerField.relationData.relationField]
                }
             }
          }
          else{
            return ownerFieldValue
          }
        }
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



    initDatasource(bag,ownerField,ownerFieldValue){
        this.createFieldEnableAndVisibleCriteria(bag,ownerField,ownerFieldValue)
        return bag
    }
      
      createFieldEnableAndVisibleCriteria(bag,ownerField,ownerFieldValue){
        let {view,subViews} = bag||{}
        let self = this
        try{
          ((view||{}).fields||[]).map(fd=>{
              fd.visibleCriteria= createCriteria(fd.visible)
              fd.enableCriteria = createCriteria(fd.enable)
              return fd
          })
          if(ownerField && ownerFieldValue!==undefined){
            let relFd = self.getOwnerRelationField((view||{}).fields,(view||{}).app,(view||{}).model,ownerField,ownerFieldValue)
            if(relFd){
              let rFD = ((view||{}).fields||[]).find(x=>x.name === relFd.name)
              if(rFD){
                  rFD.enableCriteria=createCriteria("false")
              }
            }
          }
         
          (subViews||[]).map(rv=>{
             if(rv.view){
                (rv.view.fields||[]).map(rfd=>{
                  rfd.visibleCriteria= createCriteria(rfd.visible)
                  rfd.enableCriteria = createCriteria(rfd.enable)
                  return rfd
                })
                let relFd = self.getOwnerRelationField(rv.view.fields,rv.view.app,rv.view.model,ownerField,ownerFieldValue)
                if(relFd){
                  let rFD = ((view||{}).fields||[]).find(x=>x.name === relFd.name)
                  if(rFD){
                      rFD.enableCriteria=createCriteria("false")
                  }
                }
             }
             return rv
          })
        }
        catch
        {
  
        }
      }
      
      getOwnerRelationField(fields,app,model,ownerField,ownerFieldValue){
        if(ownerField.relationData.targetApp===app && ownerField.relationData.targetModel===model){
            return fields.find(x=>x.name===ownerField.relationData.targetField)
        }
        else if(ownerField.relationData.relationApp===app && ownerField.relationData.relationModel === model){
            return fields.find(x=>x.name===ownerField.relationData.relationField)
        }
      }

    didMount(view){
        this.fetchData({view})
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
        this.didMount(view)
    }

    onSizeChange(view,size){
        let self = this
        let {viewParam} = view.props
        const {ownerField}=viewParam||{}
        setListPageSize(self.app,
            self.model,
            self.viewType,
            ownerField,
            size)
        self.fetchData({view,pageSize:size})
    }

    onCurrentChange(view,currentPage){
        let self = this
        let {viewParam} = view.props
        const {ownerField}=viewParam||{}
        setListCurrentPage(self.app,
            self.model,
            self.viewType,
            ownerField,
            currentPage)
        self.fetchData({view,pageIndex:currentPage})
    }

    getSerachBoxDefaultFieldValue(fd){
        let meta = (fd||{}).meta
        return (meta||{}).value
    }

    getSearchBoxFieldValue(view,fd,localData){
        if(!fd){
            return undefined
        }
        const {searchBox} = localData||{}
        const {criteria} = searchBox||{}
        let value = (criteria||{})[fd.name]
        if(value==undefined){
            value=this.getSerachBoxDefaultFieldValue(fd)
        }
        return value
    }

    onSearchBoxCriteriaChange(view,fd,value){
        let self = this
        let {viewParam}= view.props
        const {ownerField}=viewParam||{}
        setListOpSearchBoxCriteriaValue(self.app,
            self.model,
            self.viewType,
            ownerField,
            fd.name,value)
    }

    toggleShowSearchBox(view){
        let {viewParam,localData}= view.props
        const {ownerField}=viewParam||{}
        localData=localData||{}
        const {searchBox} = localData
        console.log(searchBox)
        if(searchBox && searchBox.visible){
            setListOpSearchBoxVisible(this.app,this.model,this.viewType,ownerField,false)
        }
        else{
            setListOpSearchBoxVisible(this.app,this.model,this.viewType,ownerField,true)
        }
    }
    addCriteriaTag(){
        ModalSheetManager.openAlert({
            title:"提示",
            msg:"赶工中..."
        })
    }
    toDetail(view,trigger){
        let self =this
        const {viewParam,viewRefType} = view.props
        let arg = trigger[ARGS]
        let id = arg.id
        if((viewParam||{}).ownerField){
            if(id){
                const {ownerField,ownerFieldValue,orgState} = viewParam
                let dViewParam = createDetailParam(ownerField,ownerFieldValue,undefined,orgState,id)
                this.showAppModelViewInModalQueue(trigger.app,trigger.model,trigger.viewType,viewRefType,dViewParam)
            }
            else{
                const {ownerField,ownerFieldValue,orgState} = viewParam
                const external={
                  getDatasource:(tag)=>{return self.getDatasource(view,tag)},
                  setDatasource:(datasource)=>{self.setDatasource(view,datasource)}
                }
                let tag =arg.tag
                let bindOwnerField = bindRecordTag(ownerField,tag)
                let dViewParam = createViewParam(bindOwnerField,ownerFieldValue,external,orgState)
                this.showAppModelViewInModalQueue(this.app,this.model,ViewType.CREATE,viewRefType,dViewParam)
            }
        }
        else{
            let routerPath = getRoutePath(trigger.app,trigger.model,trigger.viewType)
            goRoute(routerPath+"/"+arg.id,{modelID:id})
        }
    }

    doDelete(view,trigger){
        let arg = trigger[ARGS]
        let {id,tag}=arg
        let self=this
        const {viewParam} = view.props
        const {ownerField,orgState}=(viewParam||{})
        if(id){
            new ModelAction(this.app,this.model).call("delete",{
                id
            },function(res){
            if(res.errorCode==0){
                removeListContextViewDataRecord(self.app,self.model,self.viewType,[tag],ownerField)
            }
            else{
                ModalSheetManager.openAlert({
                    msg:res.description
                })
              
            }
            },function(err){
                ModalSheetManager.openAlert({
                    msg:"通讯失败！"
                })
            })
        }
        else{
            removeListContextViewDataRecord(self.app,self.model,self.viewType,[tag],ownerField)
        }
        
    }

    getDatasource(view,tag){
        const {viewData} = view.props
        var r = ((((viewData||{}).data||{})["record"]||[]).find(x=>x[RECORD_TAG]==tag))||{}
        let ret= {
            app:this.app,
            model:this.model,
            record:r
        }
         ret[RECORD_TAG]=tag
         return ret
    }

    buildFromSingleDatasource(data){
        let tag = data[RECORD_TAG]
        return bindRecordTag(data.record,tag)
        
    }
    setDatasource(view,data){
        let record = this.buildFromSingleDatasource(data)
        this.updateOrAddRecordToListViewData(view,record)
    }
    updateOrAddRecordToListViewData(view,record){
        const {viewParam} = view.props
        updateListContextViewDataRecord(this.app,this.model,this.viewType,record,(viewParam||{}).ownerField)
    }
    toAdd(view){
        const {viewParam,viewRefType} = view.props
        let self = this
        if((viewParam||{}).ownerField){
            const {ownerField,ownerFieldValue,orgState} = viewParam
            const external={
              getDatasource:(tag)=>{return self.getDatasource(view,tag)},
              setDatasource:(datasource)=>{self.setDatasource(view,datasource)}
            }
            let tag = nextRecordTag()
            let bindOwnerField = bindRecordTag(ownerField,tag)
            let dViewParam = createViewParam(bindOwnerField,ownerFieldValue,undefined,external,orgState)
            this.showAppModelViewInModalQueue(this.app,this.model,ViewType.CREATE,viewRefType,dViewParam)
        }
        else{
            self.closeModalSheet(view)
            var path=getRoutePath(this.app,this.model,ViewType.CREATE)
            view.props.dispatch(push(path))
        }
    }
    closeModalSheet(view){
        const {viewParam} = view.props
        const {external} = (viewParam||{})
        external && external.close && external.close(view)
    }
    doSelSingleItem(view,trigger){
        let arg = trigger[ARGS]
        const {viewParam} = view.props
        const {external} = (viewParam||{})
        external && external.selSingleItemAction && external.selSingleItemAction(arg.data)
        external && external.close && external.close(view)
    }
}