import React from 'react'
import { Route, withRouter,Switch} from "react-router-dom"
import {connect} from 'react-redux'
import Loadable from 'react-loadable'
const appInContainers={
    "core":Loadable({
        loader: () => import('../bgcore/CoreInContainer'),
        loading: () => <div/>,
    }),
    "corp":Loadable({
        loader: () => import('../bgcorp/CorpInContainer'),
        loading: () => <div/>,
    })
}
class DynamicRouter extends React.Component{

    render(){
        return <Switch>
        {
            // this.props.uiAppCache!=undefined && Object.keys(this.props.uiAppCache).map((key,index)=>{
            //     let appCacheUI=this.props.uiAppCache[key]
            //     if(appCacheUI==undefined || appCacheUI.app==undefined || appCacheUI.app.uiInServer<1){
            //         return null
            //     }
            //     let {rPath,AppContainer}=createAppContainer(appCacheUI,self.props.uiAppCache)
            //     return <Route path={rPath} component={withRouter(connect(inMapStateToProps)(AppContainer))} key="1"></Route>
            // })
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
