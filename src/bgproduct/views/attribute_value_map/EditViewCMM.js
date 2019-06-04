


import {EditViewCMM as BaseViewCMM} from '../../../app/cmm/EditViewCMM'
import { RECORD_TAG } from '../../../app/ReservedKeyword';
import { ModelAction } from '../../../app/mq/ModelAction';
import { setCreateContextViewData, updateCreateContextViewData } from '../../../app/actions/appContext';

export class EditViewCMM extends BaseViewCMM{
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
                        if(productAttributeValueField){
                            updateCreateContextViewData(self.app,self.model,self.viewType,
                                ownerField,productAttributeValueField,{
                                    options:[]
                                })
                        }
                    }
                }
            }
            if(productAttributeValueField){
                super.onFieldValueChange(productAttributeValueField,undefined,view)
            }
        }
        super.onFieldValueChange(fd,value,view)
    }
}

