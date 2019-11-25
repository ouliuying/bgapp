
import React from "react"
import PartnerRuleListStore from "../store/PartnerRuleListStore"
import { addAppModelViewStore } from "../../app/reducers/appModelViewDataStore"
import {connect} from 'react-redux'
import { BaseTemplateView } from "../../app/template/BaseTemplateView"
import {Table,Pagination} from '../../ui'
import PartnerViewRuleListStore from "../store/PartnterViewRuleListStore"

const store = new PartnerViewRuleListStore()
class PartnerViewRuleList extends React.Component{
    render(){
        return <div></div>
    }
}

addAppModelViewStore(store)

export default connect(state=>{
    return store.mapStateToProps(state)
})(PartnerViewRuleList)




