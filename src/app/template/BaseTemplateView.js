import React, { Children } from 'react'
export class  BaseTemplateView extends React.Component{
    render(){
        const {actions,children} = this.props
        return <div className="bg-model-op-view bg-flex-full">
                    <div className="bg-model-op-view-actions">
                        {actions}
                    </div>
                    <div className="bg-model-op-view-body">
                        {children}
                    </div>
                </div>
    }
}


