import React from "react"
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
    setListContextCriteria,
    setEventLogContextData,
    setEventLogOpSearchBoxVisible,
    setEventLogOpSearchBoxCriteriaValue,
    setEventLogCurrentPage,
    setEventLogPageSize
} from '../actions/appContext'
import { goBack,push } from 'connected-react-router';
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import {CREATE_VIEW_DATA, RECORD_TAG,ARGS, MODEL_FIELD_UPDATE_FLAG} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper'
import {viewDataFromEventLogContext, localDataFromEventLogContext} from '../reducers/appContext'
import {ModalSheetManager} from '../modelView/ModalSheetManager'
import {Button} from '../../ui'
import {createDetailParam,createViewParam, createModelActionParam} from '../modelView/ViewParam'
import { and } from '../../criteria'
import ViewType from "../modelView/ViewType"
import {produce} from 'immer'
import {bindRecordTag} from '../fieldHelper'
import {nextRecordTag} from '../../lib/tag-helper'
import {getExpression} from '../../lib/criteria-helper'
import { createCriteria } from "../modelView/ViewFieldCriteria";
import ViewFieldTypeRegistry from '../modelView/ViewFieldTypeRegistry'
import {original} from "immer"
import { getIcon } from "../../svg"
import moment from "moment"
export class EventLogViewCMM extends  ViewCMM{
    constructor(app,model,viewType){
        super(app,model,viewType)
    }
    static get s_viewType(){
        return ViewType.EVENT_LOG_LIST
    }

    mapTo(state, ownProps){
        let baseProps= super.mapTo(state, ownProps);
        const {appModelViewType,viewParam} = ownProps
        const {ownerField} = (viewParam||{})
        let installApps=getAppsSelector(state)
        const {app,model,viewType}=appModelViewType
        let viewData=viewDataFromEventLogContext(state)({app,model,viewType,ownerField})
        let localData=localDataFromEventLogContext(state)({app,model,viewType,ownerField})
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
        let {totalCount,eventLogs,triggerGroups} = viewData
        let {localData} = view.props
        let {pageData} = localData||{}
        let pageSize = (pageData && pageData.pageSize)||10
        let currentPage = (pageData && pageData.pageIndex)||1
        totalCount = totalCount||0
        return {currentPage,totalCount,pageSize,eventLogs,triggerGroups}

    }
    addDateControl(eventLogs){
        let nEventLogs = []
        if(eventLogs.length>0){
            let dateTag =  moment(eventLogs[0].date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
            nEventLogs.push({
                text:"日",
                title:dateTag
            })
            for(let el of eventLogs){
                let nDateTag = moment(el.date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
                if(nDateTag!=dateTag){
                    dateTag = nDateTag
                    nEventLogs.push({
                        text:"日",
                        title:dateTag
                    })
                }
                nEventLogs.push(el)
            }
        }
        return nEventLogs
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


    fetchData(opts){
        const {view}=opts
        let {viewParam,localData}= view.props
        const {ownerField,ownerModelID}=viewParam||{}
        const {pageData} = localData
        let pageIndex = (pageData&&pageData.pageIndex)||1
        let pageSize = (pageData&&pageData.pageSize)||10
        if(opts.pageIndex!=undefined){
            pageIndex = opts.pageIndex
        }
        if(opts.pageSize!=undefined){
            pageSize = opts.pageSize
        }
        //let criteria = this.getCriteria(view)
        var reqParam={
           app:ownerField.app,
           model:ownerField.model,
           modelID:ownerModelID,
           page:pageIndex,
           pageSize:pageSize
        }
        var self=this
        new ModelAction("core","modelLog").call("loadPageData",reqParam,function(data){
        data.bag && setEventLogContextData(
            self.app,
            self.model,
            self.viewType,
            {
                eventLogs:self.addDateControl(data.bag.eventLogs),
                totalCount: data.bag.totalCount||0,
                triggerGroups:data.bag.triggerGroups
            },
            ownerField,
        )
        },function(err){
            console.log(err)
        })
    }
      
   
      


    didMount(view){
        this.fetchData({view})
    }

    onCriteriaValueChange(data){
        let self=this
       // setListContextCriteria(self.app,self.model,self.viewType,data.name,data)
    }


    search(view){
        this.didMount(view)
    }

    onSizeChange(view,size){
        let self = this
        let {viewParam} = view.props
        const {ownerField}=viewParam||{}
        setEventLogPageSize(self.app,
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
        setEventLogCurrentPage(self.app,
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
        setEventLogOpSearchBoxCriteriaValue(self.app,
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
            setEventLogOpSearchBoxVisible(this.app,
                this.model,
                this.viewType,
                ownerField,
                false)
        }
        else{
            setEventLogOpSearchBoxVisible(this.app,
                this.model,
                this.viewType,
                ownerField,
                true)
        }
    }
}