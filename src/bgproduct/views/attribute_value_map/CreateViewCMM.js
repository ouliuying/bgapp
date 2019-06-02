import {CreateViewCMM as BaseViewCMM} from '../../../app/cmm/CreateViewCMM'
import { RECORD_TAG } from '../../../app/ReservedKeyword';
import { ModelAction } from '../../../app/mq/ModelAction';
import { setCreateContextViewData, updateCreateContextViewData } from '../../../app/actions/appContext';

export class CreateViewCMM extends BaseViewCMM{
    constructor(app,model,viewType){
        super(app,model,viewType)
    }
    onFieldValueChange(fd,value,view){
        let self= this
        if(fd.name=="productAttribute"){
            let {viewData,viewParam} = view.props||{}
            let {ownerField} = viewParam||{}
            let {view:viewObj} = viewData||{}
            let productAttributeValueField = (viewObj.fields||[]).find(x=>x.name=="productAttributeValue")
            if(fd.meta){
                let d=fd.meta.options.find(x=>x.record.id==value.record.id)
                if(d){
                    let values = d.record.values
                    if(values && values.record){
                        let valueOptions = []
                        values.record.map(x=>{
                            valueOptions.push({
                                app:values.app,
                                model:values.model,
                                record:x
                            })
                        })
                        let productAttributeValueMeta={
                            options:valueOptions
                        }
                        if(productAttributeValueField){
                            updateCreateContextViewData(self.app,self.model,self.viewType,
                                ownerField,productAttributeValueField,productAttributeValueMeta)
                        }
                    }
                    else{
                        updateCreateContextViewData(self.app,self.model,self.viewType,
                            ownerField,productAttributeValueField,{
                                options:[]
                            })
                    }
                }
            }
        }
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
    initDatasource(bag,datasource){

        if(datasource){

            bag["data"]=datasource
        }
        return bag
    }
}

