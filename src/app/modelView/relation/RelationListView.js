import React from 'react'
import {connect} from 'react-redux'
import {ReducerRegistry} from '../../../ReducerRegistry'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import hookView from '../../HookView'
import ViewFieldStyle from '../ViewFieldStyle'
import ViewFieldTypeRegistry from '../ViewFieldTypeRegistry'
import {mapStateToProps} from '../createViewMapStateToProps'
import {Button,Form,Tabs,Table, MessageBox} from 'element-react'
class RelationListView extends React.Component{
    constructor(props){
        super(props)
    }

    onFieldValueChange(fd,value){
        const {cmmHost} = this.props
        cmmHost.onFieldValueChange(fd,value)
    }

    render(){
        let self =this
        const {viewData,cmmHost,app,model,viewType,ownerField}= self.props
        let fields = ((viewData.view||{}).fields||[]).filter(f=>{
            return (f.style==ViewFieldStyle.HEAD ||
            f.style==ViewFieldStyle.SUB_HEAD ||
            f.style==ViewFieldStyle.NORMAL)
        })

        return <hookView.Hook hookTag="body-relation-op-field-view" render={()=>{
            return fields.map(pfd=>{
                let commonGroupFields=[]
                for(var fd of fields){
                    
                    let currGF=null
                    if(fd.colSpan>1){
                        currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
                        commonGroupFields.push(currGF)
                    }
                    else{
                        if(commonGroupFields.length>0){
                            currGF=commonGroupFields[commonGroupFields.length-1]
                            if(currGF.colCount>1){
                                currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
                                commonGroupFields.push(currGF)
                            }
                        }
                        else{
                            currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
                            commonGroupFields.push(currGF)
                        }
                    }
                    currGF.fields.push(fd)
                    currGF.components.push(ViewFieldTypeRegistry.getComponent(fd.type))
                    currGF.colCount=currGF.colCount+fd.colSpan
                    if(currGF.rowSpan<fd.rowSpan){
                        currGF.rowSpan=fd.rowSpan
                    }
                }

               
                        const fieldValues=(viewData.data||{}).record
                        return <div className="bg-model-op-view-body-common">
                            <h3>fd.title</h3>
                            <div>


                            <Form labelPosition="top">
                            {
                                commonGroupFields.map((gfs,index)=>
                                {
                                        const Com1=gfs.components[0]
                                        let props1=null
                                        let props2=null
                                        let key1=null
                                        let key2=null
                                        let value1=null
                                        let value2=null
                                        let meta1=null
                                        let meta2=null
                                        const  Com2=gfs.components.length>1?gfs.components[1]:null
                                        if(Com1){
                                            let fd=gfs.fields[0]
                                            meta1=self.getViewFieldMeta(fd)
                                            key1=`${fd.app}_${fd.model}_${fd.name}`
                                            value1=fieldValues[fd.name]!==undefined?fieldValues[fd.name]:""
                                            props1={
                                                name:fd.name
                                            }
                                            if(fd.relationData){
                                                props1.relationData=fd.relationData
                                                props1.orgSelData={}
                                            }
                                        }
                                        if(Com2){
                                            let fd=gfs.fields[1]
                                            meta2=self.getViewFieldMeta(fd)
                                            value2=fieldValues[fd.name]!==undefined?fieldValues[fd.name]:""
                                            key2=`${fd.app}_${fd.model}_${fd.name}`
                                            props2={
                                                name:fd.name
                                            }
                                            if(fd.relationData){
                                                props2.relationData=fd.relationData
                                                props2.orgSelData={}
                                            }
                                        }
                                        return (gfs.fields.length>1||gfs.colCount===1)?(
                                                <Form.Item key={`fi-${key1}`}>
                                                    <div className="bg-model-op-view-body-common-two-col">
                                                        <div className="bg-model-op-view-body-common-two-col-first">
                                                        <Form.Item label={gfs.fields[0].title}>
                                                            <Com1 {...props1} onChange={(value)=>{
                                                                        self.onFieldValueChange(gfs.fields[0],value)
                                                                    }} key={key1} value={value1} meta={meta1}></Com1>
                                                        </Form.Item>
                                                        </div>
                                                        <div className="bg-model-op-view-body-common-two-col-second">
                                                        {Com2!=null && (<Form.Item label={gfs.fields[1].title}>
                                                            <Com2 {...props2} onChange={(value)=>{
                                                                        self.onFieldValueChange(gfs.fields[1],value)
                                                                    }} key={key2} value={value2} meta={meta2}>></Com2>
                                                        </Form.Item>)
                                                    }
                                                        </div>
                                                    </div>
                                                </Form.Item>):(
                                                    <div className="bg-model-op-view-body-common-one-col" key={`fi-${key1}`}>
                                                        <Form.Item label={gfs.fields[0].title}>
                                                            <Com1 {...props1} onChange={(value)=>{
                                                                        self.onFieldValueChange(gfs.fields[0],value)
                                                                    }} key={key1} value={value1} meta={meta1}>></Com1>
                                                        </Form.Item>  
                                                    </div>
                                                
                                            )         
                                })
                            }
                        </Form>

                            </div>
                        </div>
                
            })
        }}>
        </hookView.Hook>
    }
}
export default hookView.withHook(withRouter(connect(mapStateToProps)(RelationListView)))