import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import {push} from 'connected-react-router'
import {Button,Table,Pagination,Tag,Row, Col,Icon as FontIcon,Divider} from "../../ui"
import hookView from '../../app/HookView'
import ListView from '../../app/modelView/ListView'
import { departmentListViewMapStateToProps } from '../statemapprops/departmentListViewMapStateToProps'

class DepartmentListView extends React.Component{
    constructor(props){
        super(props)
        const {cmmHost,parent}=this.props
        if(!parent){
            this.cmmHost=cmmHost
            this.cmmHost.init(this)
        }
        else{
            this.parent=parent
            this.cmmHost=cmmHost
        }
    }
   
    componentDidMount(){
       // console.log("listview componentDidMount")
       // window.addEventListener("resize", ()=>{this.windowSizeUpdate()});
        this.cmmHost.didMount(this)
    }
    componentWillUnmount(){
       // window.removeEventListener("resize", ()=>{this.windowSizeUpdate()});
    }
    componentWillMount(){
      //  this.windowSizeUpdate();
    }
    windowSizeUpdate(){
        try
        {
            var w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
            this.setState({width: width, height: height});
        }
        catch(err){

        }
    }
    overrideRender(hookTag,props){
        const self = this

        const DepartmentTreeView = self.cmmHost.getDepartmentTree(this)
        switch(hookTag){
            case "listViewBody":
                {
                    return  <>{DepartmentTreeView}</>
                }
            default:
                    return null
        }
    }
    render(){
        const self=this
        self.cmmHost.update(this)
        return  <hookView.HookProvider value={{cmmHost:self.cmmHost,parent:self}}>
                    <ListView {...self.props}></ListView>
                </hookView.HookProvider>
       
    }
}

export default hookView.withHook(withRouter(connect(departmentListViewMapStateToProps)(DepartmentListView)))

