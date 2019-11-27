
import React from 'react'
import { PartnerMenuRuleCreateStore } from '../store/PartnerMenulRuleCreateStore'
import { addAppModelViewStore } from '../../app/reducers/appModelViewDataStore'
import {connect} from 'react-redux'
import { BaseTemplateView } from '../../app/template/BaseTemplateView'
import {Button,Form,Alert,Tree,Select} from '../../ui'
const store = new PartnerMenuRuleCreateStore()
const {TreeNode} = Tree
class PartnerMenuRuleCreate extends React.Component{
    componentDidMount(){
        store.didMount(this)
    }
    renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.title}  dataRef={item} />
    })
    render(){
        let self = this
        const treeData=store.getTreeData(self)
        console.log(treeData)
        let {roles,appMenus} = store.getMetaData(self)
        roles=roles||[]
        appMenus = appMenus||[]
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
                   <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} className="bg-v-form">
                        <Form.Item label="角色">
                         <Select value={store.getFieldValue(self,"currentRole")} 
                         disabled={store.isDisable(self,"currentRole")}
                         onChange={
                             value=> store.onFieldChange(self,"currentRole",value)
                         }>
                             {
                                 roles.map(r=>{
                                 return <Select.Option  value={r.id}>{
                                     r.name
                                 }</Select.Option>
                                 })
                             }

                         </Select>
                        </Form.Item>

                        <Form.Item label="应用">
                         <Select value={store.getFieldValue(self,"currentApp")} 
                            disabled={store.isDisable(self,"currentApp")}
                            onChange={
                                value=> store.onFieldChange(self,"currentApp",value)
                            }>
                             {
                                 appMenus.map(r=>{
                                 return <Select.Option  value={r.name}>{
                                     r.title
                                 }</Select.Option>
                                 })
                             }

                         </Select>
                        </Form.Item>


                        <Form.Item label="菜单(选中为隐藏)">
                        <Tree
                            checkable
                            autoExpandParent={true}
                            selectedKeys={[]}
                            checkedKeys={
                                store.getFieldValue(self,"menuKeys")
                            }
                            onCheck={keys=>{
                                console.log(keys)
                               store.onFieldChange(self,"menuKeys",keys)
                            }}
                        >
                           {this.renderTreeNodes(treeData)}
                        </Tree>

                        </Form.Item>
                   </Form>

        </BaseTemplateView>
    }
}

addAppModelViewStore(store)

export default connect(state => {
    return store.mapStateToProps(state)
})(PartnerMenuRuleCreate)



