import React from 'react'
import {connect} from 'react-redux'
import {ReducerRegistry} from '../ReducerRegistry'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import appRouteLoader from './appRouteLoader'
import {getModelView} from './modelView/ModelViewRegistry'
import {push} from 'connected-react-router'
import {Menu} from '../ui'
import {createIconFromSvg} from '../icon/createIconFromSvg'
import {getCurrentApp,getOpenMenuKeys} from '../reducers/config'
//import {getUIAppCache} from '../reducers/sys'
import {getAppViewsMenu} from './reducers/appInContainer'
import {ModelAction} from './mq/ModelAction'
import HookContext from './HookContext';
import {setAppInContainerViewMenu} from './actions/appInContainer'
import {getDynamicRouterApp,getDynamicRouterAppModelViewType} from '../reducers/router'
import {setOpenMenuKeys} from '../actions/config'
class AppInContainer extends React.Component{
    constructor(props){
        super(props)
        const {currApp} =this.props
        this.app=currApp
    }

    isSubMenu(sm){
        return ((sm.viewType==null && sm.viewType===undefined)
        && (sm.subMenu!=null && sm.subMenu!==undefined) )
    }

    showModelView(appModelView){
        var items=appModelView.split(',')
        if(items.length===3){
            this.props.dispatch(push(`/app/dynamic/${items[0]}/${items[1]}/${items[2]}`))
        }
    }
    componentDidMount(){
        let self=this
        //const currApp=this.props.currApp
        const {routerApp} = this.props
        new ModelAction("core","app").call("loadAppContainer",{
            app:routerApp,
            menu:{
                app:self.app.name,
                menu:"main"
            }
        },function(data){
            data.bag && setAppInContainerViewMenu(
                self.app.name,
                data.bag["views"],
                data.bag["main"]
               )
           },function(err){
                console.log(err)
           })
    }

    render(){
        var self=this
        const {views,menu,modelViews:appModelViews,routerApp,appModelViewType} = this.props
        let dyMenu=menu||{
            subMenu:[]
        }
        let dyViews = views||{}

        const AppIcon=createIconFromSvg({
            src:this.app.icon,
            svgStyle:{width:18,height:18,fill:'#0ab73d'}
        })
        let openKey = `${appModelViewType.app},${appModelViewType.model},${appModelViewType.viewType}`
        let subOpenKey=this.props.openMenuKeys
        console.log(subOpenKey)
        return <div className="bg-app-container bg-flex-full">
            {/* <div className="bg-app-container-header">
                <h3>
                   <AppIcon></AppIcon>
                    &nbsp;{this.app.title}
                </h3>
            </div> */}
            <div className="bg-app-container-body bg-flex-full">
                <div className="bg-app-container-body-menu">
               
                <h3 className="bg-app-container-body-menu-header">
                {dyMenu.title}
                </h3>
                <Menu theme="dark"  mode="inline" defaultOpenKeys={subOpenKey} onOpenChange={(openKeys)=>{
                    console.log(openKeys)
                    setOpenMenuKeys(openKeys)
                }}  defaultSelectedKeys={[openKey]}  onClick={(arg)=>this.showModelView(arg.key)}>
                    {
                        dyMenu.subMenu.map((sm,index)=>{
                            console.log("index = "+index)
                            return this.isSubMenu(sm)?(
                                <Menu.SubMenu title={sm.title} key={index}>
                                    {
                                        sm.subMenu.map((sm2)=>{
                                            let key=`${sm2.app},${sm2.model},${sm2.viewType}`
                                        return this.isSubMenu(sm2)?(null):(<Menu.Item key={key}>
                                        {sm2.title}</Menu.Item>)})
                                    }
                                </Menu.SubMenu>
                            ):(<Menu.Item  key={`${sm.app},${sm.model},${sm.viewType}`}>
                            {sm.title}</Menu.Item>)
                        })
                    }
                </Menu>
                </div>
                <div className="bg-app-container-body-content bg-flex-full">
                    <Switch>
                        {
                            Object.keys(dyViews).map((key,index)=>{
                                let model = key
                                let modelViews= dyViews[key]
                                let modelPath="/app/dynamic/"+routerApp+"/"+model
                                return <Route path={modelPath} key={modelPath} render={props=>{
                                    return (
                                        <Switch>
                                            {
                                                modelViews.map((viewType,index)=>{
                                                    const mView=appModelViews.find(x=>{
                                                        return x.model === model && x.viewType === viewType
                                                    })
                                                    let modelViewPath=modelPath+"/"+viewType
                                                    if(mView){
                                                        return <Route path={modelViewPath} component={mView.component} key={modelViewPath}/>
                                                    }
                                                    else{
                                                      
                                                        const DefComponent=getModelView(this.app.name,model,viewType)
                                                        return <Route path={modelViewPath} component={DefComponent} key={modelViewPath}/>
                                                    }
                                                })
                                            }
                                        </Switch>
                                    )
                                }}></Route>
                            })
                        }
                    </Switch>
                </div>
            </div>
        </div>
    }
}

function inMapStateToProps(state){
    let app=getCurrentApp(state)
    let routerApp=getDynamicRouterApp(state)
    let vm = getAppViewsMenu(state)(app.currApp.name)
    let appModelViewType = getDynamicRouterAppModelViewType(state)
    let openMenuKeys=getOpenMenuKeys(state)
    return Object.assign({},app,vm,routerApp,appModelViewType,openMenuKeys)
}
export default withRouter(connect(inMapStateToProps)(AppInContainer))