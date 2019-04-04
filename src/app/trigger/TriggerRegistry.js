

import {DoCreate,DoCancel} from './baseTriggers'
export class TriggerRegistry{
    static setTrigger(app,model,name,trigger){
        let r=TriggerRegistry.appModelTriggers.reverse()
        let index=r.findIndex(el=>{
            return el.s_app===app  && el.s_model===model && el.s_name===name
        })
        
        if(index<0){
            r.push({app,model,name,trigger})
        }
        else{
            r[index]={app,model,name,trigger}
        }
        TriggerRegistry.appModelTriggers=r.reverse()
    }

    static setTriggerClass(cls){
        TriggerRegistry.setTrigger(cls.s_app,cls.s_model,cls.s_name,()=>{
            var t=new cls(...arguments)
            return t.do()
        })
    }

    static getAppModelTriggerObject(app,model,name){
        let amt=TriggerRegistry.appModelTriggers.find(el=>{
            return el.s_app===app  && el.s_model===model && el.s_name===name
        })
        if(!amt && model!=="*"){
            amt=TriggerRegistry.appModelTriggers.find(el=>{
                return el.s_app===app  && el.s_model==="*" && el.s_name===name
            })
        }
        if(!amt && app!=="*" && model!=="*"){
            amt=TriggerRegistry.appModelTriggers.find(el=>{
                return el.s_app==="*"  && el.s_model==="*" && el.s_name===name
            })
        }
        return amt
    }
    static getTrigger(app,model,name){
        var amt=TriggerRegistry.getAppModelTriggerObject(app,model,name)
        return amt?amt.trigger:undefined
    }
}

TriggerRegistry.appModelTriggers=[]

TriggerRegistry.setTriggerClass(DoCreate)
TriggerRegistry.setTriggerClass(DoCancel)