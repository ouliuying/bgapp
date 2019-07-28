import { EditViewCMM } from "../../app/cmm/EditViewCMM";
import { buildServerEditData } from "../../app/reducers/appContext";
import { ModalSheetManager } from "../../app/modelView/ModalSheetManager";
import ModelActionView from "../../app/modelView/ModelActionView";
import { ModelAction } from "../../app/mq/ModelAction";
import { getRoutePath, goRoute } from "../../app/routerHelper";
import _ from "lodash"
export class SmsSettingEditViewCMM extends EditViewCMM{
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
                ModalSheetManager.alert({title:"提示",msg:"保存成功"})
            }
        }
        else{
          ModalSheetManager.alert({title:"提示",msg:res.description})
        }
       
        },function(err){
          ModalSheetManager.alert({title:"提示",msg:"通讯失败！"})
        }))
    }
}