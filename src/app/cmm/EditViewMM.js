
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
export class EditViewCMM extends ViewCMM{

    constructor(app,model,viewType){
      super(app,model,viewType)
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
        return createViewParam(ownerField,ownerFieldValue,null,null)
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
        let {viewParam,viewData}= view.props
        let {ownerField,ownerFieldValue} = (viewParam||{})
        let modelID = this.getModelID(view)
        let rawFieldValue = this.getOwnerFieldRawFieldValue(this.app,this.model,ownerField,ownerFieldValue)
        var reqParam={
            viewType:this.viewType,
            ownerField:ownerField?{
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name,
                value:rawFieldValue
            }:undefined,
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
        new ModelAction(this.app,this.model).call("edit",editData,function(res){
        if(res.errorCode==0){
            
            if(external && external.close){
              if(external && external.setDatasource){
                 external.setDatasource(datasource)
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
        })
    }

    doAction(view,trigger){
        this[trigger.name].call(this,view)
    }
 
    doReload(view){
      this.reloadEditContextData(view)
    }
}