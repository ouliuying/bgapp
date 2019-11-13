
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
  setCreateContextFieldValue,
  clearCreateContextFieldValue,
  setCreateContextViewData,
} from '../actions/appContext'

import produce from "immer"
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import {CREATE_VIEW_DATA} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper'
import {
    viewDataFromCreateContext,
    buildServerCreateData} from '../reducers/appContext'
import {ModalSheetManager} from '../modelView/ModalSheetManager'
import {createViewParam,createDetailParam} from '../modelView/ViewParam'
import ViewType from '../modelView/ViewType'
import {RECORD_TAG} from '../ReservedKeyword'
import _ from 'lodash'
import { createCriteria } from '../modelView/ViewFieldCriteria';
export class CreateViewCMM extends ViewCMM{

    constructor(app,model,viewType){
      super(app,model,viewType)
      this._dataReady = false
    }
    get isDataReady(){
      return this._dataReady
    }
    static get s_viewType(){
        return ViewType.CREATE
    }

    mapTo(state, ownProps){
      let baseProps= super.mapTo(state, ownProps);
      const {appModelViewType,viewParam} = ownProps
      const ownerField = (viewParam||{}).ownerField
      let installApps=getAppsSelector(state)
      const {app,model,viewType}=appModelViewType
      let viewData=viewDataFromCreateContext(state)({app,model,viewType,ownerField})
      let newProps= Object.assign({},installApps,{viewData})
       return Object.assign({},baseProps,newProps,ownProps);
    }

    init(view){
      
    }

    update(view){

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
        let self= this
        let {viewParam,viewRefType}= view.props
        let {ownerField,ownerFieldValue,external,ownerModelID} = (viewParam||{})
        let {getDatasource} = (external||{})
        let rawOwnerFieldValue = self.getOwnerFieldRawFieldValue(this.app,this.model,ownerField,ownerFieldValue)
        let recordTag = ownerField?ownerField[RECORD_TAG]:undefined
        let datasource = getDatasource&&getDatasource(recordTag)
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
                model:this.model
            }
        }
        
        new ModelAction(this.app,this.model).call("loadModelViewType",reqParam,function(data){
          self._dataReady=true
        data.bag && setCreateContextViewData(
            self.app,
            self.model,
            self.viewType,
            self.initDatasource(data.bag,datasource,ownerField,ownerFieldValue),
            ownerField
        )
        },function(err){
          self._dataReady=true
            console.log(err)
        })
    }

    initDatasource(bag,datasource,ownerField,ownerFieldValue){
      this.createFieldEnableAndVisibleCriteria(bag,ownerField,ownerFieldValue)
      if(datasource){
         bag["data"]=datasource
      }
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

    getOwnerRelationFieldValues(viewParam,viewData){
      //const {viewParam,viewData} = view.props
      let {ownerField,ownerFieldValue} = (viewParam||{})
      if(ownerField){
        if((ownerField.relationData||{}).targetApp==this.app && (ownerField.relationData||{}).targetModel==this.model){
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
       else if((ownerField.relationData||{}).relationApp==this.app && (ownerField.relationData||{}).relationModel == this.model){
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

    // getOwnerRelationFieldValues(view){
    //   const {viewData,ownerField}=self.props
    //   const  {view}=viewData||{}
    //   if(view && ownerField){
    //     let f = view.fields.find(x=>{
    //       x.name = ownerField.relationData.targetField
    //     })
    //     return f
    //   }
    // }

    onFieldValueChange(fd,value,view){
      const {viewParam,viewData} = view.props
      let relationFieldValues =this.getOwnerRelationFieldValues(viewParam,viewData)
      if(!relationFieldValues){
        setCreateContextFieldValue([[fd,value]])
      }
      else{
        setCreateContextFieldValue([[fd,value],relationFieldValues])
      }
  }

  getSubRefViewParam(view,subRefView,ownerField){
    const {viewData} = view.props
    const {data}=(viewData||{})
    let ownerFieldValue = (data.record||{})[ownerField.name]
    let ownerModelID = (data.record||{})["id"]
    return createViewParam(ownerField,ownerFieldValue,ownerModelID,undefined,undefined)
  }

  showDetail(view,id){
    const {viewParam,viewRefType} = view.props
    if((viewParam||{}).ownerField){
      const {ownerField,ownerFieldValue,orgState} = viewParam
      let dViewParam = createDetailParam(ownerField,ownerFieldValue,undefined,orgState,id)
      this.showAppModelViewInModalQueue(this.app,this.model,ViewType.DETAIL,viewRefType,dViewParam)
    }
    else{
      var editPath=getRoutePath(this.app,this.model,"detail/"+id)
      goRoute(editPath,{id:id})
    }
  }
  doCreate(view,trigger){
      let self=this
      const {viewParam,viewData} = view.props
      const {ownerField,orgState,external}=(viewParam||{})
      let {getDatasource,setDatasource,close,reload} = (external||{})
       if(close && setDatasource){
        let tag = ownerField[RECORD_TAG]
        let datasource = _.cloneDeep(viewData.data||{})
        datasource[RECORD_TAG]=tag
        setDatasource(datasource)
        close && close()
      }
      else{
        let createData= buildServerCreateData(self.app,self.model,self.viewType,ownerField,orgState)
        createData && createData.record && (new ModelAction(this.app,this.model).call("create",createData,function(res){
            if(res.errorCode==0){
                if(reload){
                   reload()
                   close && close()
                   return
                }
                var newID=res.bag["id"]
                self.showDetail(view,newID)
            }
            else{
              ModalSheetManager.openAlert({title:"提示",
              msg:res.description
              })
            }
            },function(err){
              ModalSheetManager.openAlert({title:"提示",
              msg:"通讯失败！"
              })
            }))
            if(!createData || !createData.record){
              ModalSheetManager.openAlert({title:"提示",
              msg:"输入数据后再提交"
              })
            }
      }
  }
  
  doAction(view,trigger){
     super.doAction(view,trigger)//this[trigger.name].call(this,view)
  }

  doCancel(view){
    const {viewParam} = view.props
    const {ownerField,external}=(viewParam||{})
      clearCreateContextFieldValue(this.app,this.model,this.viewType, ownerField)
      if(external && external.close){
        external.close()
      }
  }
}