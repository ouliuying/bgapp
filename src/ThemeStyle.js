import React from 'react'

export default class ThemeStyle extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){
        const {body,root}=this.props
        document.body.className=body
        document.getElementById("root").className=root
    }
    render(){
        return null
    }
}
