import React from 'react'
import ReactSVG from 'react-svg'
import '../theme/css/icon.scss'
export function createIconFromSvg(
    {
        src="/icon/res/icon_test.svg",
        svgClassName="bg-icon-svg",
        svgStyle={color:"white"},
        wrapper="span",
        className="bg-icon",
        onClick=() => {
            console.log('wrapper onClick')
            }
    }={}
){

    class InIcon extends React.Component{
        constructor(props){
            super(props)
            onClick=props.onClick||onClick
        }
        render(){

            return <ReactSVG
                    src={src}
                    evalScripts="always"
                    fallback={() => <span>不支持SVG</span>}
                    loading={() => <span></span>}
                    onInjected={(error, svg) => {
                    if (error) {
                        console.error(error)
                        return
                    }
                    }}
                    renumerateIRIElements={false}
                    svgClassName={svgClassName}
                    svgStyle={svgStyle}
                    wrapper={wrapper}
                    className={className}
                    onClick={onClick}
                />
        }
    }

    return InIcon
}