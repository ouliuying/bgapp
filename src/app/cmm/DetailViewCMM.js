
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
  setDetailContextViewData
} from '../actions/appContext'

import produce from "immer"
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import {CREATE_VIEW_DATA} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper'
import {
    viewDataFromDetailContext} from '../reducers/appContext'
import {Button,Form,Tabs,Table, MessageBox} from 'element-react'

export class DetailViewCMM extends ViewCMM{

    constructor(app,model,viewType){
      super(app,model,viewType)
    }

    static get s_viewType(){
        return "detail"
    }

    mapTo(state, ownProps){
      let baseProps= super.mapTo(state, ownProps);
      const {appModelViewType,ownerField} = ownProps
      let installApps=getAppsSelector(state)
      const {app,model,viewType}=appModelViewType
      let viewData=viewDataFromDetailContext(state)({app,model,viewType,ownerField})
      let newProps= Object.assign({},installApps,{viewData})
      return Object.assign({},baseProps,newProps,ownProps)
    }

    init(view){
   
    }

    update(view){
       
            
    }

    getModelID(view){
        let {modelID} = view.props
        if(!modelID){
            modelID = this.getModelIDFromPath(view)
        }
        return modelID
    }

    getModelIDFromPath(view){
        let state = view.props["__inner_store__"].state
        let pathname = state.router.location.pathname
        let items=pathname.split('/')
        return items[6]
    }

    didMount(view){
        let {ownerField,viewData}= view.props
        let modelID = this.getModelID(view)
        var reqParam={
            viewType:this.viewType,
            ownerField:ownerField&&{
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name
            },
            reqData:{
                app:this.app,
                model:this.model,
                id:modelID
            }
        }
        var self=this
        new ModelAction(this.app,this.model).call("loadModelViewType",reqParam,function(data){
        data.bag && setDetailContextViewData(
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
    doAction(view,trigger){
        this[trigger.name].call(this,view)
    }
    toEdit(view,trigger){
        var id = this.getModelID(view)
        let rPath = getRoutePath(this.app,this.model,"edit")
        rPath=rPath+"/"+id
        goRoute(rPath,{modelID:id})
    }
    doCancel(view){
        
    }
}