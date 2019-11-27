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
import { Form, Tabs, Row, Col } from "../../ui"
import { getColor } from "../../lib/color-helper"
import { Icon } from "antd"
import PartnerViewRuleCreateStore from "../store/PartnerViewRuleCreateStore"
import StoreTable from "antd/lib/table/Table"




const store = new PartnerViewRuleCreateStore()

class ModelViewTypeRuleComponent extends React.Component {
    render() {
        let { viewType, viewMeta, viewData } = this.props
        let { fields, actionGroups } = viewMeta || {}
        fields=fields||[]
        actionGroups=actionGroups||[]
        let self = this 
        return <div className="bg-view-type-rule">
            <Form>
            <Form.Item label="授权">
            <Checkbox onChange={evt => store.onViewTypeFieldChange(self,viewType,"enable", evt.target.checked)} checked={store.getViewTypeFieldValue(self,viewType,"enable")}></Checkbox>
            </Form.Item>

                <Form.Item label="">
                    <span className="ant-form-text bg-form-item-bottom-border">视图字段</span>
                </Form.Item>
                {
                    fields.map(f => {
                        return <Form.Item>
                            <Row gutter={[16, 16]}>
                                <Col span={6}>{f.name}</Col>
                                <Col span={6}>{
                                    <Checkbox onChange={
                                        evt => store.onViewTypeFieldChange(self,viewType,"field", {fd:f,value:evt.target.checked,name:"disable"})
                                    } checked={store.getViewTypeFieldValue(self,viewType,"field",{fd:f,name:"disable"})}>隐藏</Checkbox>
                                }</Col>
                                <Col span={2}>
                                    条件
                                </Col>
                                <Col span={10}>
                                    <Input placeholder="字段表达式" onChange={
                                       evt => store.onViewTypeFieldChange(self,viewType,"field", {fd:f,value:evt.target.value,name:"exp"})
                                    }  value={
                                        store.getViewTypeFieldValue(self,viewType,"field",{fd:f,name:"exp"})
                                    }/>
                                </Col>
                            </Row>
                        </Form.Item>
                    })
                }

            </Form>

            <Form>
                <Form.Item label="">
                        <span className="ant-form-text bg-form-item-bottom-border">操作</span>
                </Form.Item>
                {
                    actionGroups.map(ag=>{
                        let triggers = ag.triggers||[]
                        return triggers.map(t=>{
                            return <Form.Item>
                                        <Row gutter={[16, 16]}>
                                            <Col span={6}>{t.name+"/"+t.title}</Col>
                                            <Col span={6}>{
                                                <Checkbox onChange={
                                                    evt => store.onViewTypeFieldChange(
                                                        self,viewType,"trigger", 
                                                        {group:ag,
                                                        trigger:t,
                                                        value:evt.target.checked,
                                                        name:"disable"}
                                                        )
                                                } checked={store.getViewTypeFieldValue(self,viewType,"trigger", {group:ag,
                                                    trigger:t,
                                                    name:"disable"})}>隐藏</Checkbox>
                                            }</Col>
                                            <Col span={2}>
                                                条件
                                            </Col>
                                            <Col span={10}>
                                                <Input placeholder="字段表达式"  onChange={
                                                          evt => store.onViewTypeFieldChange(
                                                            self,viewType,"trigger", 
                                                            {group:ag,
                                                            trigger:t,
                                                            value:evt.target.value,
                                                            name:"exp"}) 
                                                }/>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                        })
                    })
                }
            </Form>
        </div>
    }
}
class PartnerViewRuleCreate extends React.Component {
    componentDidMount() {
        store.didMount(this)
    }
    render() {
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
                } disabled={store.disableResetButton(self)}>
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
                    <Select value={store.getFieldValue(self, "currentRole")} 
                    disabled={store.isDisable(self,"currentRole")}
                    onChange={value => {
                        store.onFieldChange(self, "currentRole", value)
                    }}>
                        {
                            roles.map(r => {
                                return <Select.Option value={r.id}>
                                    {r.name}
                                </Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="模型">
                    <Select value={store.getFieldValue(self, "currentModel")} 
                    disabled={store.isDisable(self,"currentModel")}
                    onChange={
                        value => {
                            store.onFieldChange(self, "currentModel", value)
                        }
                    }>
                        {
                            models.map(m => {
                                return <Select.Option value={`${m.app}/${m.model}`}>
                                    {`${m.app}/${m.model}/${m.title}`}
                                </Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="视图">
                    <Tabs onChange={key => {
                        store.onFieldChange(self, "currentView", key)
                    }} activeKey={store.getFieldValue(self, "currentView")}>
                        {
                            modelViews.map(v => {
                                return <Tabs.TabPane tab={v.viewType} key={v.viewType}>
                                    <ModelViewTypeRuleComponent 
                                    viewType={v.viewType} 
                                    viewMeta={store.getViewMeta(self,v.viewType)}
                                    viewData = {store.getViewData(self,v.viewType)}
                                    />
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

export default connect(state => {
    return store.mapStateToProps(state)
})(PartnerViewRuleCreate)


