
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
  setDetailContextViewData
} from '../actions/appContext'

import { ModelAction } from '../mq/ModelAction'
import { getRoutePath,goRoute } from '../routerHelper'
import {
    viewDataFromDetailContext} from '../reducers/appContext'
import {createViewParam,createEditParam} from '../modelView/ViewParam'
import ViewType from '../modelView/ViewType'
import { createCriteria } from '../modelView/ViewFieldCriteria';
export class DetailViewCMM extends ViewCMM{

    constructor(app,model,viewType){
      super(app,model,viewType)
      this._dataReady = false
    }

    get isDataReady(){
        return this._dataReady
    }

    static get s_viewType(){
        return ViewType.DETAIL
    }

    mapTo(state, ownProps){
      let baseProps= super.mapTo(state, ownProps);
      const {appModelViewType,viewParam} = ownProps
      const {ownerField} = (viewParam||{})
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
        let {modelID,viewParam} = view.props
        const {modelID:vModelID,ownerField} = viewParam||{}
        if(vModelID){
            return vModelID
        }
        if(!modelID && !ownerField){
            modelID = this.getModelIDFromPath(view)
        }
        return modelID
    }

    getSubRefViewParam(view,subRefView,ownerField){
        const {viewData} = view.props
        const {data}=(viewData||{})
        let ownerFieldValue = (data.record||{})[ownerField.name]
        let ownerModelID = (data.record||{})["id"]
        console.log("modelid = "+ownerModelID + subRefView.refView.fieldName)
        let p= createViewParam(ownerField,ownerFieldValue,ownerModelID,undefined,undefined,undefined)
        return p
    }

    getModelIDFromPath(view){
        const {viewParam} = view.props
        let state = (viewParam||{}).orgState
        let pathname = state.router.location.pathname
        let items=pathname.split('/')
        return items.length>6?items[6]:undefined
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

    didMount(view){
        let {viewParam,viewData,viewRefType}= view.props
        const {ownerField,ownerFieldValue,ownerModelID} = viewParam
        let modelID = this.getModelID(view)
        let rawOwnerFieldValue = this.getOwnerFieldRawFieldValue(this.app,this.model,ownerField,ownerFieldValue)
        var reqParam={
            viewType:this.viewType,
            viewRefType:viewRefType,
            ownerField:ownerField?{
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name,
                value:rawOwnerFieldValue
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
            data.bag && setDetailContextViewData(
                self.app,
                self.model,
                self.viewType,
                self.initDatasource(data.bag,ownerField,ownerFieldValue),
                ownerField,
            )
          
        },function(err){
            console.log(err)
            self._dataReady=true
        })
    }
 
    initDatasource(bag,ownerField,ownerFieldValue){
        this.createFieldEnableAndVisibleCriteria(bag,ownerField,ownerFieldValue)
        return bag
    }
      
      createFieldEnableAndVisibleCriteria(bag,ownerField,ownerFieldValue){
        let {view,subViews,triggerGroups} = bag||{}
        let self = this
        try{
            (triggerGroups||[]).map(tg=>{
                tg.triggers.map(t=>{
                    t.visibleCriteria = createCriteria(t.visible)
                    t.enableCriteria = createCriteria(t.enable)
                })
            })
        }
        catch(ex){
            console.log(ex)
        }
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
    doAction(view,trigger){
        this[trigger.name].call(this,view)
    }
    toEdit(view,trigger){
        var id = this.getModelID(view)
        const {viewParam,viewRefType} = view.props
        if((viewParam||{}).ownerField){
            const {ownerField,ownerFieldValue,orgState} = viewParam
            let eViewParam = createEditParam(ownerField,ownerFieldValue,undefined,id,undefined,orgState)
            this.showAppModelViewInModalQueue(this.app,this.model,ViewType.EDIT,viewRefType,eViewParam)
        }
        else{
            let rPath = getRoutePath(this.app,this.model,ViewType.EDIT)
            rPath=rPath+"/"+id
            goRoute(rPath,{modelID:id})
        }
    }
    doCancel(view){
        
    }
}