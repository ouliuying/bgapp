import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
  setCreateContextFieldValue,
  clearCreateContextFieldValue,
  setCreateContextViewData
} from '../actions/createContext'

import produce from "immer"
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import {CREATE_VIEW_DATA} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper'
import {
    viewDataFromCreateContext,
    getCreateContextFieldValue,
    buildServerCreateData} from '../reducers/createContext'
import {Button,Form,Tabs,Table, MessageBox} from 'element-react'
import {getDefaultRelationModelView} from '../modelView/relation'

export class ListViewCMM extends  ViewCMM{
    constructor(app,model,viewType){
        super(app,model,viewType)
    }

    static get s_viewType(){
        return "list"
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


    doAction(view,trigger){
        this[trigger.name].call(this,view)
    }
    search(view){
        
    }

    onSizeChange(view,size){
        
    }
    onCurrentChange(view,currentPage){
      
    }
  
    doAdd(view){
        var path=getRoutePath(this.app,this.model,"create")
        this.props.dispatch(push(path))
    }
    
}