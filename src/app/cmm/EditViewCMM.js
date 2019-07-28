
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
export class EditViewCMM extends ViewCMM{

    constructor(app,model,viewType){
      super(app,model,viewType)
      this._dataReady = false
    }
    get isDataReady(){
      return this._dataReady
    }
    static get s_viewType(){
        return ViewType.EDIT
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
    getSubRefViewParam(view,subRefView,ownerField){
        const {viewData} = view.props
        const {data}=(viewData||{})
        let ownerFieldValue = (data.record||{})[ownerField.name]
        let ownerModelID = (data.record||{})["id"]
        return createViewParam(ownerField,ownerFieldValue,ownerModelID,undefined,undefined)
    }
    getModelID(view){

        let {modelID,viewParam} = view.props
        const {modelID:vModelID} = viewParam||{}
        if(vModelID){
            return vModelID
        }
        if(!modelID){
            modelID = this.getModelIDFromPath(view)
        }
        return modelID
    }


    getModelIDFromPath(view){
        const {viewParam} = view.props
        let state = (viewParam||{}).orgState
        let pathname = state.router.location.pathname
        let items=pathname.split('/')
        return items.length>6?items[6]:undefined
    }

    reloadEditContextData(view){
        let {viewParam,viewData,viewRefType}= view.props
        let {ownerField,ownerFieldValue,ownerModelID} = (viewParam||{})
        let modelID = this.getModelID(view)
        let rawFieldValue = this.getOwnerFieldRawFieldValue(this.app,this.model,ownerField,ownerFieldValue)
        var reqParam={
            viewType:this.viewType,
            viewRefType:viewRefType,
            ownerField:ownerField?{
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name,
                value:rawFieldValue
            }:undefined,
            ownerModelID:ownerModelID?ownerModelID:undefined,
            reqData:{
                app:this.app,
                model:this.model,
                id:modelID
            }
        }
        var self=this
        new ModelAction(this.app,this.model).call("loadModelViewType",reqParam,function(data){
          self._dataReady=true
          data.bag && setEditContextViewData(
              self.app,
              self.model,
              self.viewType,
              self.initDatasource(data.bag,ownerField,ownerFieldValue),
              ownerField,
          )
        },function(err){
          self._dataReady=true
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
      this.reloadEditContextData(view)
    }


    
    getOwnerRelationFieldValues(view){
      const {viewParam,viewData} = view.props
      let {ownerField,ownerFieldValue} = (viewParam||{})
      if(ownerField){
        if(ownerField.relationData.targetApp==this.app && ownerField.relationData.targetModel==this.model){
          if(ownerFieldValue instanceof Object){
             let rawValue = ownerFieldValue.record?ownerFieldValue.record[ownerField.relationData.targetField]:ownerFieldValue[ownerField.relationData.targetField]
             if(rawValue){
               let fd=viewData.view.fields.find(x=>x.name==ownerField.relationData.targetField)
               return fd?[fd,rawValue]:undefined
             }
          }
          else if(ownerFieldValue!=undefined){
            let fd=viewData.view.fields.find(x=>x.name==ownerField.relationData.targetField)
            if(fd){
              return [ownerField,ownerFieldValue]
            }
          }
       }
       else if(ownerField.relationData.relationApp==this.app && ownerField.relationData.relationModel == this.model){
         if(ownerFieldValue instanceof Object){
           let rawValue = ownerFieldValue.record?ownerFieldValue.record[ownerField.relationData.relationField]:ownerFieldValue[ownerField.relationData.relationField]
           if(rawValue){
             let fd=viewData.view.fields.find(x=>x.name==ownerField.relationData.relationField)
             return fd?[fd,rawValue]:undefined
           }
        }
        else if(ownerFieldValue!=undefined){
          let fd=viewData.view.fields.find(x=>x.name==ownerField.relationData.relationField)
          if(fd){
            return [fd,ownerFieldValue]
          }
        }
       }
      }
    }
    onFieldValueChange(fd,value,view){
        let relationFieldValues =this.getOwnerRelationFieldValues(view)
        if(!relationFieldValues){
            setEditContextFieldValue([[fd,value]])
        }
        else{
            setEditContextFieldValue([[fd,value],relationFieldValues])
        }
        
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

    doSave(view){
        let self=this
        const {viewParam,viewData} = view.props
        let datasource = _.cloneDeep(viewData.data||{})
        const {ownerField,orgState,external}=(viewParam||{})
        let editData= buildServerEditData(self.app,self.model,self.viewType,ownerField,orgState)
        if(!editData.record){
          ModalSheetManager.alert({title:"提示",msg:"没有输入任何数据！"})
        }
        editData && editData.record && (new ModelAction(this.app,this.model).call("edit",editData,function(res){
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