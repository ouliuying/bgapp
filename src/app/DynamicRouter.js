import React from 'react'
import { Route, withRouter,Switch} from "react-router-dom"
import {connect} from 'react-redux'
import Loadable from 'react-loadable'
import MainFrame from '../bgchat/MainFrame';
import CoreInContainer from '../bgcore/CoreInContainer'
import CorpInContainer from '../bgcorp/CorpInContainer'
import ProductInContainer from '../bgproduct/ProductInContainer'
import CrmInContainer from '../bgcrm/CrmInContainer'
import AccountInContainer from '../bgaccount/AccountInContainer'
import WorktableInContainer from '../bgworktable/WorktableInContainer'
import SettingInContainer from '../bgsetting/SettingInContainer'
import SmsInContainer from '../bgsms/SmsInContainer'
import ChatInContainer from '../bgchat/ChatInContainer'
import AdminInContainer from '../bgadmin/AdminInContainer'
const appInContainers={
    "core":CoreInContainer,
    "corp":CorpInContainer,
    "product":ProductInContainer,
    "crm":CrmInContainer,
    "account":AccountInContainer,
    "worktable":WorktableInContainer,
    "setting":SettingInContainer,
    "sms":SmsInContainer,
    "im":MainFrame,
    "chat":ChatInContainer,
    "admin":Loadable({
       loader: () => import('../bgadmin/AdminInContainer'),
       loading:() => <div/>,
    })
}
function TestApp(){
    return <div>test</div>
}
class DynamicRouter extends React.Component{

    render(){
        return <Switch>
        {
            Object.keys(appInContainers).map(key=>{
                const AppInContainer=appInContainers[key]
                const rPath="/app/dynamic/"+key
                return <Route path={rPath} component={AppInContainer} key={rPath}></Route>
            })
        }
        </Switch>
    }
}

function mapStateToProps(state){
   return {}
}
export default withRouter(connect(mapStateToProps)(DynamicRouter))
