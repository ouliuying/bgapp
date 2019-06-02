import React from 'react'
import HookContext from './HookContext'
function withHook(Component,opts={}){
    class HookComponent extends React.Component{
        render(){
            const {cmmHost,parent,...rest} = this.props
            return <HookContext.Consumer>
                {
                    value=>{
                        let tValue=value
                        if(tValue){

                            tValue = Object.assign({},tValue,{cmmHost:cmmHost?cmmHost:tValue.cmmHost,parent:parent?parent:tValue.parent})
                        }
                        else{
                            tValue={cmmHost,parent}
                        }
                        return <Component {...rest} {...tValue}></Component> 
                    }
                }
            </HookContext.Consumer>
        } 
    }
    return HookComponent
}

class HookProvider extends React.Component{
    render(){
        const {value,children}= this.props
        return <HookContext.Provider value={value}>
             {children}
        </HookContext.Provider>
    }
}

class  HookView extends React.Component{  
    render(){
        const {render,hookTag,...rest} = this.props
        return <HookContext.Consumer>
            {
                value=>
                {
                    let parent = value.parent
                    let parentChain=[]
                    while(parent){
                        if(parent.overrideRender){
                            if(parentChain.indexOf(parent)<0){
                                parentChain.push(parent)
                            }
                        }
                        parent = parent.parent
                    }
                    if(parentChain.length>0){
                        for(let p of parentChain){
                            let res = p.overrideRender(hookTag,rest)
                            if(res){
                                return res
                            }
                        }
                    }
                    try{
                        return render(rest)
                    }
                    catch{
                        return <></>
                    }
                   
                }
            }
        </HookContext.Consumer>
    }
}

export default {Hook:HookView,withHook,HookProvider}