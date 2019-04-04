
//View Controller Model stateToProp Mapper Registry
import {DummyViewCMM} from './ViewCMM'
import {CreateViewCMM} from './CreateViewCMM'
export class ViewCMMRegistry{
    static addCMM(cmmCls){
        let rCMMClsArr=ViewCMMRegistry.cmmClsArr.reverse()
        let index=rCMMClsArr.findIndex(cls=>{
            return cls.s_app===cmmCls.s_app && cls.s_model===cmmCls.s_model && cls.s_viewType===cmmCls.s_viewType
        })
        if(index>-1){
            rCMMClsArr[index]=cmmCls
        }
        else{
            rCMMClsArr.push(
                cmmCls
            )
        }
        ViewCMMRegistry.cmmClsArr=rCMMClsArr.reverse()
    }
    static getCMM(app,model,viewType){
        let m=ViewCMMRegistry.cmmClsArr.find(el=>{
            return el.s_app===app  && el.s_model===model && el.s_viewType===viewType
        })
        if(!m && model!=="*"){
            m=ViewCMMRegistry.cmmClsArr.find(el=>{
                return el.s_app===app  && el.s_model==="*" && el.s_viewType===viewType
            })
        }
        if(!m && app!=="*" && model!=="*"){
            m=ViewCMMRegistry.cmmClsArr.find(el=>{
                return el.s_app==="*"  && el.s_model==="*" && el.s_viewType===viewType
            })
        }
        if(!m){
            m= DummyViewCMM
        }
        return m
    }
}

ViewCMMRegistry.cmmClsArr=[]


ViewCMMRegistry.addCMM(CreateViewCMM)




