import React from 'react'
import {Tag, Icon} from '../ui'
import { ModelAction } from '../app/mq/ModelAction'
import moment from 'moment'

class CrmStatisticSummaryView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            timeSpanType:0,
            summaryData:{
                
            },
            timeSpan:[]
        }
    }

    componentDidMount(){
      let wd = new Date().getDay()
      let nw = moment()
      let startDate = nw.add("days", 0-wd).format("YYYY-MM-DD 00:00:00")
      let endDate =nw.add("days", 7-wd + 2).format("YYYY-MM-DD 00:00:00")
      this.loadData(startDate, endDate)
    }

    loadData(startDate,endDate){
        new ModelAction("crm","crmApi").call("loadCrmSummaryData",{
            startDate,
            endDate
        },data=>{
            if(data.errorCode == 0){
                this.setState(
                    {summaryData:data.bag.data}
                 )
            }
        },err=>{
            
        })
    }

    loadTimespanSummaryData(timeSpanType,timeSpan){
        let startDate=undefined
        let endDate = undefined
        if(timeSpanType==0){
            let wd = new Date().getDay()
            let nw = moment()
            startDate = nw.add("days", 0-wd).format("YYYY-MM-DD 00:00:00")
            endDate =nw.add("days", 7-wd + 2).format("YYYY-MM-DD 00:00:00")
        }
        else if(timeSpanType == 1){
            startDate =  moment().format("YYYY-MM-01 00:00:00")
            endDate = moment(startDate,"YYYY-MM-DD HH:mm:ss").add("months",1).format("YYYY-MM-01 00:00:00")

        }
        else if(timeSpanType ==2 ){
            startDate =  moment().format("YYYY-01-01 00:00:00")
            endDate = moment(startDate,"YYYY-MM-DD HH:mm:ss").add("years",1).format("YYYY-MM-01 00:00:00")
        }
        else if(timeSpanType == 3){

        }
        else{

        }
        this.loadData(startDate,endDate)
    }
    
    render(){
        let self = this
        let activeClass = [undefined,undefined,undefined,undefined]
        activeClass[this.state.timeSpanType] = "active"
        return  <div className="bg-worktable-crm-statistic-summary">
                    <div className="area-header">
                        <span><Icon type="calculator" /> 销售简报</span> 
                        <Tag color="blue" className={activeClass[0]} style={{marginLeft:10}} onClick={()=>{
                            self.setState({
                                timeSpanType:0
                            })
                            self.loadTimespanSummaryData(0)
                        }}>本周</Tag>
                        <Tag color="blue" className={activeClass[1]} onClick={()=>{
                            self.setState({
                                timeSpanType:1
                            })
                            self.loadTimespanSummaryData(1)
                        }}>本月</Tag>
                        <Tag color="blue" className={activeClass[2]} onClick={()=>{
                            self.setState({
                                timeSpanType:2
                            })
                            self.loadTimespanSummaryData(2)
                        }}>本年</Tag>
                        <Tag color="blue" className={activeClass[3]} onClick={()=>{
                            self.setState({
                                timeSpanType:3
                            })
                            self.loadTimespanSummaryData(3)
                        }}>全部</Tag> 
                    </div>
                    <div className="bg-worktable-crm-statistic-summary-body">
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon" style={{background:'#f50'}}>
                                <Icon type="notification" />
                            </div>
                            <div>
                                <h4>推广活动</h4>
                                <span>
                                    {
                                        this.state.summaryData.eventCount!==undefined?this.state.summaryData.eventCount+"个":""
                                    }
                                </span>
                            </div>
                        </div>
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon"  style={{background:'#2db7f5'}}>
                                <Icon type="fork" />
                            </div>
                            <div>
                                <h4>线索</h4>
                                <span> 
                                    {this.state.summaryData.leadCount!==undefined?this.state.summaryData.leadCount+"个":""}
                                </span>
                            </div>
                        </div>
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon" style={{background:'#2f54eb',paddingLeft:'0.9rem'}}>
                            <Icon type="euro" />
                            </div>
                            <div>
                                <h4>商机</h4>
                                <span>
                                    {this.state.summaryData.opportunityCount!==undefined?this.state.summaryData.opportunityCount+"个":""}
                                </span>
                            </div>
                        </div>
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon" style={{background:'#108ee9',paddingLeft:'0.9rem'}}>
                            <Icon type="user-add" />
                            </div>
                            <div>
                                <h4>客户</h4>
                                <span>
                                    {this.state.summaryData.customerCount!==undefined?this.state.summaryData.customerCount+"个":""}   
                                </span>
                            </div>
                        </div>
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon"  style={{background:'#87d068'}}>
                            <Icon type="shopping-cart" />
                            </div>
                            <div>
                                <h4>订单</h4>
                                <span>
                                    {this.state.summaryData.orderCount!==undefined?this.state.summaryData.orderCount+"个":""}   
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default CrmStatisticSummaryView