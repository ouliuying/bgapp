/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react"
import PartnerRuleCreateStore from "../store/PartnerRuleCreateStore"
import { addAppModelViewStore } from "../../app/reducers/appModelViewDataStore"
import {connect} from 'react-redux'
import {Button,Select,Radio,Divider,Pagination,List,Input,TreeSelect,Checkbox} from '../../ui'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import { BaseTemplateView } from "../../app/template/BaseTemplateView"
import { Form,Tabs } from "../../ui"
import { getColor } from "../../lib/color-helper"
import { Icon } from "antd"

const store = new PartnerRuleCreateStore()
class PartnerRuleCreate extends React.Component{

    componentDidMount(){
       store.didMount(this)
    }
    onFieldChange(name,value,extra){
      store.onFieldChange(this,name,value,extra)
        
    }
    getFieldValue(name,value){
       return store.getFieldValue(this,name,value)
    }
    render(){
        let self= this
        let roles = store.getRoles(this)
        let models = store.getModels(this)
        let modelFields = store.getModelFields(this)
        let departments = store.getDepartments(this)
        let partners = store.getPartners(this)
        let rules = store.getRules(this)
        return <BaseTemplateView actions={
            <>
                <Button type="danger" onClick={
                        ()=>{
                            self.props.appModelViewStore.put({type:"doSave"})
                        }
                    }>
                    保 存
                </Button>

                <Button type="primary" onClick={
                        ()=>{
                            self.props.appModelViewStore.put({type:"doSaveAndCreate"})
                        }
                    }>
                    保 存 & 创建
                </Button>

            </>
        }>
        <Form labelCol = {{ span: 4 }} wrapperCol = {{ span: 14 }}  className="bg-v-form">
        <Form.Item label="角色">
            <Select
                style={{ width: 200 }}
                placeholder="选择一个角色"
                value = {self.getFieldValue("currentRole")}
                onChange={
                    value=>{
                        self.onFieldChange("currentRole",value)
                    }
                }
            >
                {
                    roles.map(r=>{
                        return <Select.Option value={r.id}>{r.name}</Select.Option>
                    })
                }
            </Select>
            </Form.Item>

            <Form.Item label="模型">
                    <Select
                        placeholder="选择一个目标模型"
                        value={self.getFieldValue("currentModel")} 
                        onChange={value=>{
                            self.onFieldChange("currentModel",value)
                        }}>
                            {
                                models.map(m=>{
                                    return <Select.Option value={`${m.app}/${m.model}`} key={`${m.app}/${m.model}`}>{`${m.app}/${m.model}/${m.title}`}</Select.Option>
                                })
                            }
                    </Select>
            </Form.Item>

            {/* <Form.Item label="数据操作">
                <Radio.Group value={self.getFieldValue("accessType")} onChange={evt=>{
                    self.onFieldChange("accessType",evt.target.value)
                }}>
                    <Radio value="read">读取</Radio>
                    <Radio value="create">添加</Radio>
                    <Radio value="edit">更新</Radio>
                    <Radio value="delete">删除</Radio>
                </Radio.Group>
           </Form.Item> */}
          <Form.Item label=" " colon={false}>


          <Tabs defaultActiveKey={self.getFieldValue("accessType")} onChange={(value)=>{
                 self.onFieldChange("accessType",value)
            }}>
                <Tabs.TabPane tab="读取" key="read">
               
                <Form.Item label="赋权">
                <Checkbox onChange={value=>self.onFieldChange("enable",value)} checked={self.getFieldValue("enable")}></Checkbox>
            </Form.Item>

            <Form.Item label="字段">
                <div>
                    <List
                        dataSource={modelFields}
                        renderItem={fd => {
                            let color = getColor(fd.name)
                            let fc = fd.name.substring(0,1).toUpperCase()
                            return <List.Item key={fd.name}>
                                <List.Item.Meta
                                avatar={
                                <span style={{...color,width:'1rem',height:'1rem'}}>
                                    {fc}
                                </span>
                                }
                                title={fd.title}
                                description={`改属性的名称：${fd.name}`}
                                />
                                <div>
                                    <Checkbox onChange={
                                        value=>{
                                            self.onFieldChange("field-check",{fd,check:value})
                                        }
                                    } checked={self.getFieldValue("field-check",{fd})}>Checkbox</Checkbox>
                                </div>
                            </List.Item>
                            }
                        }
                    >
                
                    </List>
                </div> 
            </Form.Item>
            <Form.Item label="限制范围">
                <Radio.Group value={self.getFieldValue("isolocation")}  onChange={
                    evt=>{
                        self.onFieldChange("isolocation",evt.target.value)
                    }
                }>
                    <Radio value="partner">本人</Radio>
                    <Radio value="corp">公司</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item label="限制部门">
                <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    value={self.getFieldValue("targetDepartments")}
                    onChange={value=>{
                        self.onFieldChange("targetDepartments",value)
                    }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="选择部门"
                    allowClear
                    multiple
                    treeData={departments}
                    treeDefaultExpandAll
                >
                </TreeSelect>
            </Form.Item>

            <Form.Item label="限制角色">
            <Select
                mode="tags"
                value={self.getFieldValue("targetRoles")}
                onChange={value=>{
                    self.onFieldChange("targetRoles",value)
                }}
                placeholder="选择目标角色"
            >
                {
                    roles.map(r=>{
                        return <Select.Option value={r.id+""} key={r.id}>{r.name}</Select.Option>
                    })
                }
            </Select>
            </Form.Item>


            <Form.Item label="限制用户">
                    <Select
                        mode = "tags"
                        value={self.getFieldValue("targetPartners")}
                        onChange={value=>{
                            self.onFieldChange("targetPartners",value)
                        }}
                        placeholder="选择目标用户"
                        >
                            {
                                partners.map(p=>{
                                return  <Select.Option value={p.id+""}>{p.userName}</Select.Option>
                                })
                            }
                    </Select>
            </Form.Item>

            <Form.Item label={<>
                <span>内置规则</span>
            </>}>
                    <div>
                    <Button type="danger">
                  <Icon type="plus"></Icon>
              </Button>
              <div>


              <List
        itemLayout="horizontal"
        dataSource={rules}
        renderItem={item => (
          <List.Item
            actions={[<a key="list-loadmore-edit">更新</a>, <a key="list-loadmore-delete">删除</a>]}
          >
              <List.Item.Meta
                title={<a>{item.name}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
          </List.Item>
        )}
      />

              </div>
                    </div>            
            </Form.Item>

            <Form.Item label="附加条件">
            <Input.TextArea
                value={self.getFieldValue("criteria")}
                placeholder=""
                autoSize={{ minRows: 3, maxRows: 5 }}
                onChange={value=>{
                    self.onFieldChange("criteria",value)
                }}
                />        
            </Form.Item>




                </Tabs.TabPane>
                <Tabs.TabPane tab="添加" key="create">
               
                </Tabs.TabPane>
                <Tabs.TabPane tab="更新" key="edit">
               
                </Tabs.TabPane>
                <Tabs.TabPane tab="删除" key="delete">
               
                </Tabs.TabPane>
            </Tabs>

          </Form.Item>
          


           
        </Form>
        </BaseTemplateView>
    }
}



addAppModelViewStore(store)

export default connect(state=>{
    return store.mapStateToProps(state)
})(PartnerRuleCreate)