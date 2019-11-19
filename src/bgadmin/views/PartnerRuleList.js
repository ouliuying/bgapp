import React from "react"
import PartnerRuleLisetStore from "../store/PartnerRuleListStore"
import { addAppModelViewStore } from "../../app/reducers/appModelViewDataStore"
import {connect} from 'react-redux'
class PartnerRuleList extends React.Component{

 render(){
     return <div>

     </div>
 }

}

const store = new PartnerRuleLisetStore()

addAppModelViewStore(store)

export default connect(state=>{
    return store.mapStateToProps(state)
})(PartnerRuleList)