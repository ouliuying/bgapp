import React from "react"
import PartnerRuleCreateStore from "../store/PartnerRuleCreateStore"
import { addAppModelViewStore } from "../../app/reducers/appModelViewDataStore"
import {connect} from 'react-redux'
import {Button} from '../../ui'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
class PartnerRuleCreate extends React.Component{
    render(){
        let self= this
        return <div>
                <Button type="danger" onClick={
                    ()=>{
                        self.props.appModelViewStore.put("show","1")
                    }
                }>
                    test
                </Button>
        </div>
    }
}

const store = new PartnerRuleCreateStore()

addAppModelViewStore(store)

export default connect(state=>{
    return store.mapStateToProps(state)
})(PartnerRuleCreate)