import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
export default class PartnerRuleLisetStore extends AppModelViewStore{
    constructor(){
        super("admin","partnerRuleApi","list")
       
    }
}

