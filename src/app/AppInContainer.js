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
import {Menu} from 'element-react'
import {createIconFromSvg} from '../icon/createIconFromSvg'
import {getCurrentApp} from '../reducers/config'
//import {getUIAppCache} from '../reducers/sys'
import {getAppViewsMenu} from './reducers/appInContainer'
import {ModelAction} from './mq/ModelAction'
import HookContext from './HookContext';
import {setAppInContainerViewMenu} from './actions/appInContainer'
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
        new ModelAction("core","app").call("loadAppContainer",{
            app:self.app.name,
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
        const {views,menu,modelViews:appModelViews} = this.props
        let dyMenu=menu||{
            subMenu:[]
        }
        let dyViews = views||{}

        const AppIcon=createIconFromSvg({
            src:this.app.icon,
            svgStyle:{width:18,height:18,fill:'#0ab73d'}
        })
        return <div className="bg-app-container bg-flex-full">
            <div className="bg-app-container-header">
                <h3>
                   <AppIcon></AppIcon>
                    &nbsp;{this.app.title}
                </h3>
            </div>
            <div className="bg-app-container-body bg-flex-full">
                <div className="bg-app-container-body-menu">
               
                <h3 className="bg-app-container-body-menu-header">
                {dyMenu.title}
                </h3>
                <Menu mode="vertical" defaultActive="1" onSelect={(index)=>this.showModelView(index)}>
                    {
                        dyMenu.subMenu.map((sm,index)=>{
                            return this.isSubMenu(sm)?(
                                <Menu.ItemGroup title={sm.title} key={index}>
                                    {
                                        sm.subMenu.map((sm2)=>{
                                            let key=`${sm2.app},${sm2.model},${sm2.viewType}`
                                        return this.isSubMenu(sm2)?(null):(<Menu.Item index={`${sm2.app},${sm2.model},${sm2.viewType}`} key={key}>
                                        {sm2.title}</Menu.Item>)})
                                    }
                                </Menu.ItemGroup>
                            ):(<Menu.Item index={`${sm.app},${sm.model},${sm.viewType}`} key={`${sm.app},${sm.model},${sm.viewType}`}>
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
                                let modelPath="/app/dynamic/"+this.app.name+"/"+model
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
    let vm = getAppViewsMenu(state)(app.currApp.name)
    return Object.assign({},app,vm)
}
export default withRouter(connect(inMapStateToProps)(AppInContainer))