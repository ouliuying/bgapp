import React from "react"
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import  {Divider,Button,Icon} from './ui'
import {ModalSheetManager} from './app/modelView/ModalSheetManager'
import {getShortcutAppsSelector,getRoleAppsSelector,getAppsSelector} from './reducers/sys'
import {updateShortcutApps} from './actions/sys'
import {createIconFromSvg} from './icon/createIconFromSvg'
import {ModelAction} from './app/mq/ModelAction'
import { getSvg } from "./svg";
class AppSetting extends React.Component{
    constructor(props){
        super(props)
        this.shortcutContainer= React.createRef()
    }

    getAppNewIndex(appName,installApps,shortcutApps,evt){
        let index=-1
        let app=installApps[appName]
        const shortcutAppsNode =  this.shortcutContainer.current
        const alis = this.shortcutContainer.current.children
        let lis=[]
        for(let li of alis){
            if(li.hasAttribute("appname")){
                lis.push(li)
            }
        }
        if(lis && lis.length>0){
            let container=shortcutAppsNode
            let cWidth = container.clientWidth
            const offset = {
                left: 0,
                top: 0
              }
            do{
                offset.left += container.offsetLeft;
                offset.top += container.offsetTop;
                container = container.offsetParent;
            }while(container)

            let cursorPos = {x:evt.pageX-offset.left+cWidth/2,y:evt.pageY-offset.top}
            let dpos=[]
            for(let li of lis){
                dpos.push({
                    appName:li.getAttribute("appname"),
                    x:li.offsetLeft,
                    y:li.offsetTop,
                    width:li.clientWidth,
                    height:li.clientHeight
                })
            }
            
            let rowDPos = []
            let leftDPos=undefined
            let rightDPos=undefined
            dpos.map(pos=>{
                if(pos.y<cursorPos.y && pos.y+pos.height>cursorPos.y){
                    if(pos.x+pos.width/2>cursorPos.x){
                        if(rightDPos){
                            if(pos.x<rightDPos.x){
                                rightDPos=pos
                            }
                        }
                        else{
                            rightDPos=pos
                        }
                    }
                    else if(pos.x+pos.width/2<cursorPos.x){
                        if(leftDPos){
                            if(pos.x>leftDPos.x){
                                leftDPos=pos
                            }
                        }
                        else{
                            leftDPos=pos
                        }
                    }
                }
            })
            if(leftDPos){
                let pIndex=shortcutApps.findIndex(x=>x.name==leftDPos.appName)
                if(pIndex>-1){
                    index=pIndex+1
                }
                console.log("left dpost "+JSON.stringify(leftDPos) + " index = "+index)
            }
            else if(rightDPos){
                let pIndex=shortcutApps.findIndex(x=>x.name==rightDPos.appName)
                if(pIndex>-1){
                    index=pIndex
                }
                console.log("right dpost "+JSON.stringify(rightDPos)+" index = "+index)
            }
        }
        else{
            index=0
        }
        return {
            index,app
        }
    }
    render(){
        let self =this
        const {shortcutApps,roleApps,installApps} = this.props
        var SaveIcon = createIconFromSvg({
            src:"/icon/res/Save-to.svg",
            svgStyle:{
                width:32,
                height:32
            }
        })
        return <div className="bg-app-shorcut-setting">
                <Divider>快捷应用</Divider>
                    <ul ref={self.shortcutContainer}  onDrop={(evt)=>{
                        evt.nativeEvent.preventDefault()
                        let appName = evt.nativeEvent.dataTransfer.getData("text");
                        let realAppName=""
                        if(appName.indexOf("shortcut|")>-1){
                            realAppName = appName.substr(9)
                        }
                        else if(appName.indexOf("role|")>-1){
                            realAppName = appName.substr(5)
                        }
                        let {index:newIndex,app} = self.getAppNewIndex(realAppName,installApps,shortcutApps,evt)
                        if(newIndex>-1){
                            var currIndex = shortcutApps.findIndex(x=>x.name === app.name)
                            if(currIndex>-1){
                                if(currIndex!=newIndex){
                                    let tShortcutAppNames = []
                                    for(let i =0;i<shortcutApps.length;i++){
                                        if(i==currIndex){
                                            continue
                                        }
                                        else if(i==newIndex){
                                            tShortcutAppNames.push(app.name)
                                            tShortcutAppNames.push(shortcutApps[i].name)
                                        }
                                        else{
                                            tShortcutAppNames.push(shortcutApps[i].name)
                                        }
                                    }
                                    if(newIndex==shortcutApps.length){
                                        tShortcutAppNames.push(app.name)
                                    }

                                    updateShortcutApps(tShortcutAppNames)
                                }
                            }
                            else{
                                let tShortcutAppNames = []

                                shortcutApps.map(x=>{
                                    tShortcutAppNames.push(x.name)
                                })

                                if(newIndex<tShortcutAppNames.length){
                                    tShortcutAppNames.splice(newIndex,0,[app.name])
                                }
                                else{
                                    tShortcutAppNames.push(app.name)
                                }
                                updateShortcutApps(tShortcutAppNames)
                            }

                        
                        }
                    }} onDragOver={(evt)=>{evt.nativeEvent.preventDefault()}}>
                        {
                            shortcutApps.map(app=>{
                                const AppIcon = getSvg(app.icon)
                                return <li className="app" appname={app.name} key={app.name} draggable={true} onDragStart={(evt)=>{
                                    evt.nativeEvent.dataTransfer.setData('text',"shortcut|"+app.name)
                                    var img = new Image(); 
                                    evt.nativeEvent.dataTransfer.setDragImage(img, 0, 0);
                            }}>
                                     <Icon component={AppIcon} style={{ fontSize: '32px'}}></Icon>
                                    <h4>
                                        <span>{app.title}</span>
                                    </h4>
                            </li>
                            })
                        }
                        <li  key="saveShortcutApps" className="ant-btn ant-btn-dashed save" onClick={()=>{
                            new ModelAction("core","app").call("saveShortcutAppSetting",shortcutApps,(ret)=>{
                                if(ret.errorCode==0){
                                    ModalSheetManager.alert({
                                        title:"提示",
                                        msg:"保存成功"
                                    })
                                }
                                else{
                                    ModalSheetManager.alert({
                                        title:"提示",
                                        msg:ret.description
                                    })
                                }
                            },()=>{
                                ModalSheetManager.alert({
                                    title:"提示",
                                    msg:"保存失败"
                                })
                            })
                        }}>
                        
                        <SaveIcon></SaveIcon>
                        <h4>
                        保存
                        </h4>
                        </li>
                    </ul>
                
                <Divider>全部应用</Divider>
            
                    <ul  onDrop={(evt)=>{
                          evt.nativeEvent.preventDefault()
                          let appName = evt.nativeEvent.dataTransfer.getData("text");
                          if(appName.indexOf("shortcut|")>-1){
                            appName = appName.substr(9)
                            let tShortcutAppNames =[]
                            shortcutApps.map(x=>{
                                if(x.name!=appName){
                                    tShortcutAppNames.push(x.name)
                                }
                            })
                            updateShortcutApps(tShortcutAppNames)
                        }
                         
                    }} onDragOver={(evt)=>{evt.nativeEvent.preventDefault()}}>
                        {
                            roleApps.map(app=>{
                                const AppIcon = getSvg(app.icon)
                                return <li className="app" appname={app.name} key={app.name} draggable={true} onDragStart={(evt)=>{
                                    evt.nativeEvent.dataTransfer.setData('text',"role|"+app.name)
                                    var img = new Image(); 
                                    evt.nativeEvent.dataTransfer.setDragImage(img, 0, 0);
                            }}>
                                    <Icon component={AppIcon} style={{ fontSize: '32px'}}></Icon>
                                    <h4>
                                        <span>{app.title}</span>
                                    </h4>
                                   
                            </li>
                            })
                        }
                    </ul>
                
        </div>
    }
}

function mapStateToProps(state){
    let shortcutApps = getShortcutAppsSelector(state)
    let roleApps = getRoleAppsSelector(state)
    let installApps = getAppsSelector(state)
    return {
        shortcutApps,
        roleApps,
        ...installApps
    }
 }
export default withRouter(connect(mapStateToProps)(AppSetting))

