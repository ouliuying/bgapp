import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
export default class PartnerRuleLisetStore extends AppModelViewStore{
    constructor(){
        super("admin","partnerRuleApi","create")
        this.reducers = Object.assign(this.reducers,{
            "show":(data)=>{
                if(typeof data == "undefined"){
                    return {}
                }
                return data
            }
        })
        this.effects = Object.assign(this.effects,{
            "show":function* () {
               yield 1
            }
        })
    }
    
    mapStateToProps(state){
        let props = super.mapStateToProps(state)
        return Object.assign({},props,{})
    }
}

