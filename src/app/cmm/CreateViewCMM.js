
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
  setCreateContextFieldValue,
  clearCreateContextFieldValue,
  setCreateContextViewData
} from '../actions/appContext'

import produce from "immer"
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import {CREATE_VIEW_DATA} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper'
import {
    viewDataFromCreateContext,
    getCreateContextFieldValue,
    buildServerCreateData} from '../reducers/appContext'
import {Button,Form,Tabs,Table, MessageBox} from 'element-react'
import {getDefaultRelationModelView} from '../modelView/relation'
export class CreateViewCMM extends ViewCMM{

    constructor(app,model,viewType){
      super(app,model,viewType)
    }

    static get s_viewType(){
        return "create"
    }

    mapTo(state, ownProps){
      let baseProps= super.mapTo(state, ownProps);
      const {appModelViewType,ownerField} = ownProps
      let installApps=getAppsSelector(state)
      const {app,model}=appModelViewType
      let viewData=viewDataFromCreateContext(state)({app,model,ownerField})
      let newProps= Object.assign({},installApps,{viewData})
       return Object.assign({},baseProps,newProps,ownProps);
    }

    init(view){
   
    }

    update(view){
       
            
    }



    didMount(view){
        let {ownerField,viewData}= view.props
        if(viewData && viewData.view){
            return
        }
        var reqParam={
            viewType:this.viewType,
            ownerField:ownerField&&{
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name
            },
            reqData:{
                app:this.app,
                model:this.model
            }
        }
        var self=this
        new ModelAction(this.app,this.model).call("loadModelViewType",reqParam,function(data){
        data.bag && setCreateContextViewData(
            self.app,
            self.model,
            data.bag,
            ownerField,
        )
        },function(err){
            console.log(err)
        })
    }



  onFieldValueChange(fd,value,opType,elemTag){
    if(opType===undefined){
        opType=0
    }
    setCreateContextFieldValue([[fd,value,opType,elemTag]])
  }

  getFieldValue(createData,field){
      return getCreateContextFieldValue(createData,field)
  }
  doCreate(view){
      let self=this
      const {ownerField,__inner_store__:innerStore}=view.props
      let createData= buildServerCreateData(self.app,self.model,ownerField,innerStore.state)
      new ModelAction(this.app,this.model).call("create",createData,function(res){
      if(res.errorCode==0){
          var newID=res.bag["id"]
          var editPath=getRoutePath(self.app,self.model,"edit")
          goRoute(editPath,{id:newID})
      }
      else{
          MessageBox.alert(res.description)
      }
      },function(err){
          MessageBox.alert("通讯失败！")
      })
  }

  doAction(view,trigger){
     this[trigger.name].call(this,view)
  }
 
  doCancel(view){
      const {ownerField}=view.props
      clearCreateContextFieldValue(this.app,this.model,ownerField)
  }
}