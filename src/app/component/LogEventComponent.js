
import React from "react"
import {connect} from 'react-redux'
import {Button} from '../../ui'
import { ModelAction } from "../mq/ModelAction"
import logEventLogControl from './logEventControl/logEventControlRegisty'
import moment from "moment"
class EventControlHeader extends React.Component{
    render(){
        const {data} = this.props
        return <><div className="bg-model-event-log-container-event-logo">
                    {
                        (data.icon) && <img src={"/storage/file/" + data.icon} alt="" className="bg-model-event-log-container-event-logo-image"/>
                    }

                    {
                       !(data.icon) &&  (data.text) && <span className="bg-model-event-log-container-event-logo-text">{data.text}</span>
                    }
                    
                </div>

                <div className="bg-model-event-log-container-event-title">
                    {data.title} <span className="bg-model-event-log-container-event-title-time">{data.date}</span>
                </div>
        </>
    }
}

class EventControl extends React.Component{
    render(){
        const {data} = this.props
        let arr=[]
        if(data.data){
            try{
                arr = JSON.parse(data.data)
            }
            catch(err){

            }
        }
        return  <div className="bg-model-event-log-container-event">
                    <EventControlHeader data={data}/>
                    {
                        arr.map(item=>{
                            if(item instanceof Object){
                                let CtrlType =  logEventLogControl.get(item.controlType)
                                return <CtrlType data={item.props} />
                            }
                            else{
                                return <span>{item}</span>
                            }
                        })
                    }
                </div>
    }
}
class LogEventComponent extends React.Component{
    constructor(props){
        super(props)
        this.state={
            eventLogs:[],
            page:1,
            more:false
        }
    }

    componentDidMount(){
        this.loadPageData(1)
    }
    addDateControl(eventLogs){
        let nEventLogs = []
        if(eventLogs.length>0){
            let dateTag =  moment(eventLogs[0].date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
            nEventLogs.push({
                text:"日",
                title:dateTag
            })
            for(let el of eventLogs){
                let nDateTag = moment(el.date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
                if(nDateTag!=dateTag){
                    dateTag = nDateTag
                    nEventLogs.push({
                        text:"日",
                        title:dateTag
                    })
                }
                nEventLogs.push(el)
            }
        }
        return nEventLogs
    }
    loadPageData(page){
        let self = this
        const {app,model,modelID} = this.props
        new ModelAction("core","modelLog").call("loadPageData",{
            app,
            model,
            modelID,
            page
        },data=>{
            if(data.errorCode == 0){
                self.setState({
                    eventLogs: self.addDateControl(data.bag.eventLogs),
                    more:data.bag.more
                })
            }
        },err=>{
            
        })
    }
    render(){
        let eventLogs = this.state.eventLogs
        return <div className="bg-model-event-log-container">
            {
                eventLogs.map(e=>{
                    return <EventControl data={e}/>
                   
                })
            }
            <div>
                {
                    this.state.page>1 &&   <Button>上一页</Button>
                }
                {
                    this.state.eventLogs.length>=10 &&  <Button>下一页</Button>
                }
            </div>
         
        </div>
    }
}

function mapStateToProps(state,ownProps){
    return Object.assign({},ownProps)
}

export default connect(mapStateToProps)(LogEventComponent)