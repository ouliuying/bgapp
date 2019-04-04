import React from 'react'
import {connect} from 'react-redux'
import {ReducerRegistry} from '../ReducerRegistry'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import appRouteLoader from './appRouteLoader'
import getDefaultModelView from './modelView'
import {push} from 'connected-react-router'
import {Menu} from 'element-react'
import {createIconFromSvg} from '../icon/createIconFromSvg'
import HookContext from './HookContext';

export function createAppContainer(appCacheUI,allAppCacheUI){
    const {app,modelViews,menus}=appCacheUI
    let rPath="/app/dynamic/"+app.name
    const mainMenu=menus["main"]
     class InAppContainer extends React.Component{
        constructor(props){
            super(props)
            this.state={appModelViews:{}}
        }
        isSubMenu(sm){
            return ((sm.viewType==null && sm.viewType===undefined)
            && (sm.subMenu!=null && sm.subMenu!==undefined) )
        }
        showModelView(appModelView){
            var items=appModelView.split(',')
            if(items.length===3){
                var state={app:items[0],model:items[1],viewType:items[2]}
                this.props.dispatch(push(`/app/dynamic/${items[0]}/${items[1]}/${items[2]}`,state))
            }
        }
        render(){
            var self=this
            const currApp=this.props.app
            let dyMenu=mainMenu
            if(currApp!=null && allAppCacheUI[currApp.name]!==undefined&&allAppCacheUI[currApp.name]!=null){
                const {menus}=allAppCacheUI[currApp.name]
                const currMainMenu=menus["main"]
                if(currMainMenu!=null && currMainMenu!==undefined){
                    dyMenu=currMainMenu
                }
            }
            if(dyMenu==null||dyMenu===undefined){
                    dyMenu={
                        subMenu:[]
                    }
            }
            const AppIcon=createIconFromSvg({
                src:app.icon,
                svgStyle:{width:18,height:18,fill:'#0ab73d'}
            })
            return <div className="bg-app-container bg-flex-full">
                <div className="bg-app-container-header">
                    <h3>
                       <AppIcon></AppIcon>
                        &nbsp;{app.title}
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
                                Object.keys(modelViews).map((key,index)=>{   
                                    let modelView= modelViews[key]
                                    let modelPath="/app/dynamic/"+app.name+"/"+modelView.model
                                    return <Route path={modelPath} key={modelPath} render={props=>{
                                        return (
                                            <Switch>
                                                {
                                                    Object.keys(modelView.views).map((key,index)=>{
                                                        var v=modelView.views[key]
                                                        let modelViewKey=`${modelView.model}_${v.viewType}`
                                                        const ModelViewComponent=self.state.appModelViews[modelViewKey]
                                                        let modelViewPath=modelPath+"/"+v.viewType
                                                        if(ModelViewComponent===undefined || ModelViewComponent==null){
                                                            const DefComponent=getDefaultModelView(v.viewType)
                                                            return <Route path={modelViewPath} render={
                                                                props=>
                                                                <HookContext.Provider value={}>
                                                                    <DefComponent {...props}></DefComponent>
                                                                </HookContext.Provider>
                                                            }  key={modelViewPath}/>
                                                        }
                                                        else{
                                                            return <Route path={modelViewPath} render={
                                                                props=>
                                                                <HookContext Provider value={}>
                                                                    <ModelViewComponent {...props}></ModelViewComponent>
                                                                </HookContext>
                                                            } key={modelViewPath}/>
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
 
     const AppContainer = InAppContainer
     return {rPath,AppContainer}
}

