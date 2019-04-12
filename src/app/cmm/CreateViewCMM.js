
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
  setCreateContextFieldValue,
  clearCreateContextFieldValue,
  setCreateContextViewData,
  setCreateContextViewDataToSource
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
      const {app,model,viewType}=appModelViewType
      let viewData=viewDataFromCreateContext(state)({app,model,viewType,ownerField})
      let newProps= Object.assign({},installApps,{viewData})
       return Object.assign({},baseProps,newProps,ownProps);
    }

    init(view){
   
    }

    update(view){
    }
    didMount(view){
        let self= this
        let {ownerField, viewData, datasourceKey}= view.props
        if(viewData && viewData.view){
            setCreateContextViewData(
                self.app,
                self.model,
                self.viewType,
                viewData,
                ownerField,
                datasourceKey
            )
            return
        }
        var reqParam={
            viewType:this.viewType,
            ownerField:ownerField && {
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name
            },
            reqData:{
                app:this.app,
                model:this.model
            }
        }
        new ModelAction(this.app,this.model).call("loadModelViewType",reqParam,function(data){
        data.bag && setCreateContextViewData(
            self.app,
            self.model,
            self.viewType,
            data.bag,
            ownerField,
            datasourceKey
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

  
  
  doCreate(view){
      let self=this
      const {ownerField,__inner_store__:innerStore,datasourceKey}=view.props
      if(datasourceKey){
        setCreateContextViewDataToSource(self.app,self.model,self.viewType,ownerField,datasourceKey)
      }
      else
      {
        let createData= buildServerCreateData(self.app,self.model,self.viewType,ownerField,innerStore.state)
        new ModelAction(this.app,this.model).call("create",createData,function(res){
            if(res.errorCode==0){
                var newID=res.bag["id"]
                var editPath=getRoutePath(self.app,self.model,"detail/"+newID)
                goRoute(editPath,{id:newID})
            }
            else{
                MessageBox.alert(res.description)
            }
            },function(err){
                MessageBox.alert("通讯失败！")
            })
      }
      const {external} = this.props
      if(external && external.close){
        external.close()
      }
  }

  doAction(view,trigger){
     this[trigger.name].call(this,view)
  }
 
  doCancel(view){
      const {ownerField}=view.props
      clearCreateContextFieldValue(this.app,this.model,this.viewType, ownerField)
      const {external} = view.props
      if(external && external.close){
        external.close()
      }
  }
}