
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
  setEditContextFieldValue,
  setEditContextViewData,
  setEditContextViewDataToSource
} from '../actions/appContext'

import produce from "immer"
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import { getRoutePath,goRoute } from '../routerHelper'
import {
    viewDataFromEditContext,
    buildServerEditData} from '../reducers/appContext'
import {Button,Form,Tabs,Table, MessageBox} from 'element-react'
export class EditViewCMM extends ViewCMM{

    constructor(app,model,viewType){
      super(app,model,viewType)
    }

    static get s_viewType(){
        return "edit"
    }

    mapTo(state, ownProps){
      let baseProps= super.mapTo(state, ownProps);
      const {appModelViewType,ownerField} = ownProps
      let installApps=getAppsSelector(state)
      const {app,model,viewType}=appModelViewType
      let viewData=viewDataFromEditContext(state)({app,model,viewType,ownerField})
      let newProps= Object.assign({},installApps,{viewData})
       return Object.assign({},baseProps,newProps,ownProps);
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

    reloadEditContextData(view){
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
        data.bag && setEditContextViewData(
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
    didMount(view){
      this.reloadEditContextData(view)
    }
    onFieldValueChange(fd,value,opType,elemTag){
        if(opType===undefined){
            opType=0
        }
        setEditContextFieldValue([[fd,value,opType,elemTag]])
    }

 
    doSave(view){
        let self=this
        const {ownerField,__inner_store__:innerStore,datasourceKey,external}=view.props
        let editData= buildServerEditData(self.app,self.model,self.viewType,ownerField,innerStore.state)
        new ModelAction(this.app,this.model).call("edit",editData,function(res){
        if(res.errorCode==0){
            if(datasourceKey){
                setEditContextViewDataToSource(self.app,self.model,self.viewType,ownerField,datasourceKey)
            }
            else{
                let modelID = self.getModelID(view)
                var detailPath=getRoutePath(self.app,self.model,"detail/"+modelID)
                goRoute(detailPath,{modelID:modelID})
            }
        }
        else{
            MessageBox.alert(res.description)
        }
        },function(err){
            MessageBox.alert("通讯失败！")
        })
        if(external && external.close){
            external.close()
        }
    }

    doAction(view,trigger){
        this[trigger.name].call(this,view)
    }
 
    doReload(view){
      this.reloadEditContextData(view)
    }
}