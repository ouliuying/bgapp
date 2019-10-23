import React from 'react'
import {Tag, Icon} from '../ui'

class CrmStatisticSummaryView extends React.Component{
    render(){
        return  <div className="bg-worktable-crm-statistic-summary">
                    <div className="area-header">
                        <span><Icon type="calculator" /> 销售简报</span> 
                        <Tag color="blue" className="active" style={{marginLeft:10}}>本周</Tag>
                        <Tag color="blue">本月</Tag>
                        <Tag color="blue">本年</Tag>
                        <Tag color="blue">全部</Tag> 
                    </div>
                    <div className="bg-worktable-crm-statistic-summary-body">
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon" style={{background:'#f50'}}>
                                <Icon type="notification" />
                            </div>
                            <div>
                                <h4>推广活动</h4>
                                <span>12个</span>
                            </div>
                        </div>
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon"  style={{background:'#2db7f5'}}>
                                <Icon type="fork" />
                            </div>
                            <div>
                                <h4>线索</h4>
                                <span>12个</span>
                            </div>
                        </div>
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon" style={{background:'#2f54eb',paddingLeft:'0.9rem'}}>
                            <Icon type="euro" />
                            </div>
                            <div>
                                <h4>商机</h4>
                                <span>12个</span>
                            </div>
                        </div>
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon" style={{background:'#108ee9',paddingLeft:'0.9rem'}}>
                            <Icon type="user-add" />
                            </div>
                            <div>
                                <h4>客户</h4>
                                <span>12个</span>
                            </div>
                        </div>
                        <div className="bg-worktable-crm-statistic-summary-item">
                            <div className="bg-worktable-crm-statistic-summary-item-icon"  style={{background:'#87d068'}}>
                            <Icon type="shopping-cart" />
                            </div>
                            <div>
                                <h4>订单</h4>
                                <span>12个</span>
                            </div>
                        </div>
                    </div>
                </div>
    }
}

export default CrmStatisticSummaryView