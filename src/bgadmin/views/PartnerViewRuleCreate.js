/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react"
import PartnerRuleCreateStore from "../store/PartnerRuleCreateStore"
import { addAppModelViewStore } from "../../app/reducers/appModelViewDataStore"
import { connect } from 'react-redux'
import { Button, Select, Radio, Divider, Modal, List, Input, TreeSelect, Checkbox } from '../../ui'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import { BaseTemplateView } from "../../app/template/BaseTemplateView"
import { Form, Tabs } from "../../ui"
import { getColor } from "../../lib/color-helper"
import { Icon } from "antd"
import PartnerViewRuleCreateStore from "../store/PartnerViewRuleCreateStore"




const store = new PartnerViewRuleCreateStore()

class ModelViewTypeRuleComponent extends React.Component{
    render(){
        let {viewType,viewMeta,viewData} = this.props

        return <div>
            
        </div>
    }
} 
class PartnerViewRuleCreate extends React.Component{
    componentDidMount(){
        store.didMount(this)
    }
    render(){
        let self = this
        let roles = store.getRoles(self)
        let models = store.getModels(self)
        let modelViews = store.getModelViews(self)
        return <BaseTemplateView actions={
            <>
                <Button type="danger" onClick={
                    () => {
                        store.doSave(self)
                    }
                }>
                    保 存
                </Button>

                <Button type="default" onClick={
                    () => {
                        store.doReset(self)
                    }
                }  disabled={store.disableResetButton(self)}>
                    重 置
                </Button>

                <Button type="primary" onClick={
                    () => {
                      
                        store.doSaveAndCreate(self)
                    }
                }>
                    保 存 & 创建
                </Button>
            </>
        }>
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} className="bg-v-form">
                <Form.Item label="角色">
                    <Select value={store.getFieldValue(self,"currentRole")} onChange={value=>{
                        store.onFieldChange(self,"currentRole",value)
                    }}>
                       {
                           roles.map(r=>{
                               return <Select.Option value={r.id}>
                                   {r.name}
                               </Select.Option>
                           })
                       }
                    </Select>
                </Form.Item>
                <Form.Item label="模型">
                    <Select value={store.getFieldValue(self,"currentModel")} onChange={
                        value=>{
                            store.onFieldChange(self,"currentModel",value)
                        }
                    }>
                        {
                           models.map(m=>{
                               return <Select.Option value={`${m.app}/${m.model}`}>
                                   {`${m.app}/${m.model}/${m.title}`}
                               </Select.Option>
                           }) 
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="视图">
                <Tabs  onChange={key=>{
                    store.onFieldChange(self,"currentView",key)
                }} activeKey={store.getFieldValue(self,"currentView")}>
                    {
                        modelViews.map(v=>{
                            return <Tabs.TabPane tab={v.viewType} key={v.viewType}>
                               {v.viewType}
                            </Tabs.TabPane>
                        })
                    }
                </Tabs>
                </Form.Item>
            </Form>
        </BaseTemplateView>
    }
}

addAppModelViewStore(store)

export default connect(state=>{
    return store.mapStateToProps(state)
})(PartnerViewRuleCreate)


