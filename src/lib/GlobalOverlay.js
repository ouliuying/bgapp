
import React,{ Component } from 'react'
import ReactDOM from "react-dom"
class GlobalOverlay extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className='bg-global-overlay'>
                <div className="bg-global-overlay-body">
                    <span>wait.....</span>
                </div>
            </div>
        )
    }
}

let _overlay
export function showGlobalOverlay(){
    if(_overlay){
        hideGlobalOverlay(_overlay)
    }
    _overlay=document.createElement("div")
    document.body.appendChild(_overlay)
    ReactDOM.render(<GlobalOverlay/>,_overlay)
}

export function hideGlobalOverlay(){
    if(_overlay){
        try{
            ReactDOM.unmountComponentAtNode(_overlay)
            document.body.removeChild(_overlay)
            _overlay=null
        }
        catch(err){
            
        }
    }
}