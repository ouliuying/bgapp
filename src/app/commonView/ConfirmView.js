import React from "react"
import {Button} from '../../ui'
import { ModelAction } from "../mq/ModelAction"
import {ModalSheetManager} from '../modelView/ModalSheetManager'
import {connect} from 'react-redux'

class ConfirmView extends React.Component{
    cancel(){
      const {viewParam} = this.props
      if(viewParam && viewParam.external && viewParam.external.close){
        viewParam.external.close()
      }
    }
    
    getModelID(){
        let {modelID,viewParam} = this.props
        const {modelID:vModelID} = viewParam||{}
        if(vModelID){
            return vModelID
        }
        return modelID
    }

    confirm(){
        let self = this
        const {app,model,actionName,viewParam} = self.props
        const {external} = viewParam||{}
        let modelID = this.getModelID()
        modelID && (new ModelAction(app,model).call(actionName,{
            modelID
        },function(res){
            if(res.errorCode==0){
                if(external && external.close){
                  if(external.reload){
                    const r=external.reload
                    r&&r()
                  }
                  external.close()
                }
            }
            else{
              ModalSheetManager.alert({title:"提示",msg:res.description})
            }
            },function(err){
              ModalSheetManager.alert({title:"提示",msg:"通讯失败！"})
            }))
    }
    render(){
        let self = this
        const {viewParam} = this.props
        const {triggerMeta} = viewParam||{}
        const message = triggerMeta.message
        return  <><div className="bg-sheet-confirm-dialog-body">
                      {message}
                    </div>
                    <div className="bg-sheet-confirm-dialog-footer">
                        <Button type="primary" onClick={()=>{
                                    self.confirm()
                                }}>确定</Button>
                                <Button type="danger" onClick={()=>{
                                   self.cancel()
                                }}>取消</Button>
                    </div>
                </>
    }
}

function mapStateToProps(state,ownProps){
    return Object.assign({},ownProps)
}
export default connect(mapStateToProps)(ConfirmView)

