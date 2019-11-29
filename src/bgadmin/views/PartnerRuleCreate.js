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

const store = new PartnerRuleCreateStore()
class AccessTypePanel extends React.Component {
    onFieldChange(name, value, extra) {
        store.onFieldChange(this, name, value, extra)

    }
    getFieldValue(name, value) {
        return store.getFieldValue(this, name, value)
    }
    render() {
        let self = this
        let roles = store.getRoles(this)
        let modelFields = store.getModelFields(this)
        let departments = store.getDepartments(this)
        let partners = store.getPartners(this)
        let rules = store.getRules(this)
        const {__access_key__} = this.props
        return <><Form.Item label="授权">
            <Checkbox onChange={evt => self.onFieldChange("enable", evt.target.checked)} checked={self.getFieldValue("enable")}></Checkbox>
        </Form.Item>

{
    (__access_key__==="delete")?<></>:<Form.Item label="字段">
    <div>
        <List
            dataSource={modelFields}
            renderItem={fd => {
                let color = getColor(fd.name)
                let fc = fd.name.substring(0, 1).toUpperCase()
                return <List.Item key={fd.name}>
                    <List.Item.Meta avatar={
                        <span style={{ ...color, width: '1rem', height: '1rem', display: 'inline-block' }}>
                            {fc}
                        </span>
                    }
                        title={fd.title}
                        description={`改属性的名称：${fd.name}`}
                    />
                    <div>
                        <Checkbox onChange={
                            evt => {
                                self.onFieldChange("field-check", { name: fd.name, value: evt.target.checked })
                            }
                        } checked={self.getFieldValue("field-check", { name: fd.name })}>禁止</Checkbox>
                    </div>
                </List.Item>
            }
            }
        >

        </List>
    </div>
</Form.Item>
}



           {(__access_key__==="create")?<></>:<Form.Item label="限制范围(A)">
                <Radio.Group value={self.getFieldValue("isolocation")}  onChange={
                    evt=>{
                        self.onFieldChange("isolocation",evt.target.value)
                    }
                }>
                    <Radio value="partner">本人</Radio>
                    <Radio value="corp">公司</Radio>
                </Radio.Group>
            </Form.Item>
            } 

{
                (__access_key__==="create")?<></>:<Form.Item label="限制角色(B)">
                <Select
                    mode="tags"
                    value={self.getFieldValue("targetRoles")}
                    onChange={value => {
                        self.onFieldChange("targetRoles", value)
                    }}
                    placeholder="选择目标角色"
                >
                    {
                        roles.map(r => {
                            return <Select.Option value={r.id + ""} key={r.id}>{r.name}</Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
            }

            {
                (__access_key__==="create")?<></>:<Form.Item label="限制部门(C)">
                 <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    value={self.getFieldValue("targetDepartments")}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="选择目标部门"
                    allowClear
                    treeDefaultExpandAll
                    multiple={true}
                    onChange={value=>{
                        self.onFieldChange("targetDepartments", value)
                    }}
                    treeData={departments}
                >
                </TreeSelect>
            </Form.Item>
            }
            

            

            {
                (__access_key__==="create")?<></>: <Form.Item label="限制用户(D)">
                <Select
                    mode="tags"
                    value={self.getFieldValue("targetPartners")}
                    onChange={value => {
                        self.onFieldChange("targetPartners", value)
                    }}
                    placeholder="选择目标用户"
                >
                    {
                        partners.map(p => {
                            return <Select.Option value={p.id + ""}>{p.userName}</Select.Option>
                        })
                    }
                </Select>
            </Form.Item>
            }
           

            <Form.Item label={<>
                <span>内置规则</span>
            </>}>
                <div>
                    <Button type="danger" onClick={() => {
                        store.showAddRuleDialog(self, true)
                    }}>
                        <Icon type="plus">

                        </Icon>
                    </Button>
                    <div>
                        <List
                            itemLayout="horizontal"
                            dataSource={rules}
                            renderItem={(item, index) => (
                                <List.Item
                                    actions={[<a key="list-loadmore-delete" onClick={
                                        () => {
                                            store.deleteRule(self, index)
                                        }
                                    }>删除</a>]}
                                >
                                    <List.Item.Meta
                                        title={<a>{item}</a>}
                                        description=""
                                    />
                                </List.Item>
                            )}
                        />

                    </div>
                </div>
            </Form.Item>

            {
                (__access_key__==="create")?<></>: <Form.Item label="附加条件(E)">
                <Input.TextArea
                    value={self.getFieldValue("criteria")}
                    placeholder=""
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    onChange={evt => {
                        self.onFieldChange("criteria", evt.target.value)
                    }}
                />
            </Form.Item>
            }
           {
               (__access_key__==="create")?<></>:<Form.Item label="重载条件">
               <Input.TextArea
                   value={self.getFieldValue("overrideCriteria")}
                   placeholder=""
                   autoSize={{ minRows: 3, maxRows: 5 }}
                   onChange={evt => {
                       self.onFieldChange("overrideCriteria", evt.target.value)
                   }}
               />
           </Form.Item>
           }
            



        </>
    }
}
class PartnerRuleCreate extends React.Component {

    componentDidMount() {
        store.didMount(this)
    }
    onFieldChange(name, value, extra) {
        store.onFieldChange(this, name, value, extra)

    }
    getFieldValue(name, value) {
        return store.getFieldValue(this, name, value)
    }
    addRule() {

    }
    render() {
        let self = this
        let roles = store.getRoles(this)
        let models = store.getModels(this)
        return <BaseTemplateView actions={
            <>
                <Button type="danger" onClick={
                    () => {
                        //self.props.appModelViewStore.put({ type: "doSave" })
                        store.doSave(self)
                    }
                }>
                    保 存
                </Button>

                <Button type="default" onClick={
                    () => {
                        //self.props.appModelViewStore.put({ type: "doSave" })
                        store.doReset(self)
                    }
                }  disabled={store.disableResetButton(self)}>
                    重 置
                </Button>

                <Button type="primary" onClick={
                    () => {
                        //self.props.appModelViewStore.put({ type: "doSaveAndCreate" })
                        store.doSaveAndCreate(self)
                    }
                }>
                    保 存 & 创建
                </Button>

            </>
        }>


            <Modal
                title="添加"
                visible={store.getAddRuleDialogVisible(self)}
                onOk={() => store.addRule(self)}
                onCancel={() => { store.showAddRuleDialog(self, false) }}
            >


                <Form layout="vertical">
                    <Form.Item label="类标识">
                        <Input value={self.getFieldValue("ruleClassID")} onChange={
                            evt => {
                                self.onFieldChange("ruleClassID", evt.target.value)
                            }
                        } />
                    </Form.Item>
                </Form>
            </Modal>


            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} className="bg-v-form">
                <Form.Item label="角色">
                    <Select
                        disabled={store.isDisable(self,"currentRole")}
                        style={{ width: 200 }}
                        placeholder="选择一个角色"
                        value={self.getFieldValue("currentRole")}
                        onChange={
                            value => {
                                self.onFieldChange("currentRole", value)
                            }
                        }
                    >
                        {
                            roles.map(r => {
                                return <Select.Option value={r.id}>{r.name}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item label="模型">
                    <Select
                        disabled={store.isDisable(self,"currentModel")}
                        placeholder="选择一个目标模型"
                        value={self.getFieldValue("currentModel")}
                        onChange={value => {
                            self.onFieldChange("currentModel", value)
                        }}>
                        {
                            models.map(m => {
                                return <Select.Option value={`${m.app}/${m.model}`} key={`${m.app}/${m.model}`}>{`${m.app}/${m.model}/${m.title}`}</Select.Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>

            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} className="bg-v-form">
                <Form.Item label=" " colon={false}>
                    <Tabs defaultActiveKey={self.getFieldValue("accessType")} onChange={(value) => {
                        self.onFieldChange("accessType", value)
                    }}>
                        <Tabs.TabPane tab="读取" key="read">
                            <AccessTypePanel {...self.props} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="添加" key="create">
                            <AccessTypePanel {...self.props}   __access_key__="create"/>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="更新" key="edit">
                            <AccessTypePanel {...self.props} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="删除" key="delete">
                            <AccessTypePanel {...self.props}   __access_key__="delete"/>
                        </Tabs.TabPane>
                    </Tabs>

                </Form.Item>




            </Form>
        </BaseTemplateView>
    }
}



addAppModelViewStore(store)

export default connect(state => {
    return store.mapStateToProps(state)
})(PartnerRuleCreate)