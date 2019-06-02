import {CreateViewCMM as BaseViewCMM} from '../../../app/cmm/CreateViewCMM'
import { RECORD_TAG } from '../../../app/ReservedKeyword';
import { ModelAction } from '../../../app/mq/ModelAction';
import { setCreateContextViewData } from '../../../app/actions/appContext';

export class CreateViewCMM extends BaseViewCMM{
    constructor(app,model,viewType){
        super(app,model,viewType)
    }
    onFieldValueChange(fd,value,view){
        
        super.onFieldValueChange(fd,value,view)
    }
    didMount(view){
        let self= this
        let {viewParam, viewData}= view.props
        let {ownerField,ownerFieldValue,external,ownerModelID} = (viewParam||{})
        let {getDatasource,setDatasource} = (external||{})
        let rawOwnerFieldValue = self.getOwnerFieldRawFieldValue(this.app,this.model,ownerField,ownerFieldValue)
        let recordTag = ownerField?ownerField[RECORD_TAG]:undefined
        let datasource = getDatasource&&getDatasource(recordTag)
        var reqParam={
            viewType:this.viewType,
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
                self.initDatasource(data.bag,datasource),
                ownerField
            )
        },function(err){
          self._dataReady=true
            console.log(err)
        })
    }
}

