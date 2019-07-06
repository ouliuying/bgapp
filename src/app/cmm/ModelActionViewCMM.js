
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
  setEditContextFieldValue,
  setEditContextViewData
} from '../actions/appContext'

import produce from "immer"
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import { getRoutePath,goRoute } from '../routerHelper'
import {
    viewDataFromEditContext,
    buildServerEditData} from '../reducers/appContext'
import {ModalSheetManager} from '../modelView/ModalSheetManager'
import {createViewParam} from '../modelView/ViewParam'
import _ from "lodash"
import ViewType from '../modelView/ViewType';
import { createCriteria } from '../modelView/ViewFieldCriteria';
export class ModelActionViewCMM extends ViewCMM{
    constructor(app,model,viewType){
      super(app,model,viewType)
    }
    mapTo(state, ownProps){
      let baseProps= super.mapTo(state, ownProps);
      const {appModelViewType,viewParam} = ownProps
      const {ownerField} = (viewParam||{})
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
        let {modelID,viewParam} = view.props
        const {modelID:vModelID} = viewParam||{}
        if(vModelID){
            return vModelID
        }
        return modelID
    }

    reloadEditContextData(view){
        let {viewParam,viewRefType}= view.props
        let {ownerField} = (viewParam||{})
        let modelID = this.getModelID(view)
        var reqParam={
            viewType:this.viewType,
            viewRefType:viewRefType,
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
              self.initDatasource(data.bag,ownerField,undefined),
              ownerField,
          )
        },function(err){
            console.log(err)
        })
    }
    
    initDatasource(bag){
      this.createFieldEnableAndVisibleCriteria(bag)
      return bag
    }
    
    createFieldEnableAndVisibleCriteria(bag){
        let {view} = bag||{}
        try{
        ((view||{}).fields||[]).map(fd=>{
            fd.visibleCriteria= createCriteria(fd.visible)
            fd.enableCriteria = createCriteria(fd.enable)
            return fd
        })
        }
        catch
        {

        }
    }
    
 


    didMount(view){
      this.reloadEditContextData(view)
    }

    onFieldValueChange(fd,value,view){
        setEditContextFieldValue([[fd,value]])
    }

  
    doSave(view){
        let self=this
        const {viewParam,viewData} = view.props
        let datasource = _.cloneDeep(viewData.data||{})
        const {ownerField,orgState,external}=(viewParam||{})
        const actionName = view.actionName
        let editData= buildServerEditData(self.app,self.model,self.viewType,ownerField,orgState)
        editData && editData.record && (new ModelAction(this.app,this.model).call(actionName,editData,function(res){
        if(res.errorCode==0){
            
            if(external && external.close){
              if(external && external.setDatasource){
                 external.setDatasource(datasource)
              }
              if(external.reload){
                const r=external.reload
                r&&r()
              }
              external.close()
            }
            else{
                let modelID = self.getModelID(view)
                var detailPath=getRoutePath(self.app,self.model,"detail/"+modelID)
                goRoute(detailPath,{modelID:modelID})
            }
        }
        else{
          ModalSheetManager.alert({title:"提示",msg:res.description})
        }
       
        },function(err){
          ModalSheetManager.alert({title:"提示",msg:"通讯失败！"})
        }))
    }

    doAction(view,trigger){
        super.doAction(view,trigger)//this[trigger.name].call(this,view)
    }
 
    doReload(view){
      this.reloadEditContextData(view)
    }
}