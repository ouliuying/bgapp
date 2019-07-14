import  { ReactComponent as CorpPartners }  from '../svg/corp-partners.svg'
import  { ReactComponent as CorpRoleMag }  from '../svg/corp-role-mag.svg'
import  { ReactComponent as CorpAppCore }  from '../svg/core-app.svg'
import {ReactComponent as MyWorkTile} from '../svg/my-worktable.svg'
import {ReactComponent as MoreApp} from '../svg/icon-more.svg'
const svgs={
    
}
//TODO  load dynamic svg by server config
svgs["/svg/corp-partners.svg"]=CorpPartners
svgs["/svg/corp-role-mag.svg"]=CorpRoleMag
svgs["/svg/core-app.svg"]=CorpAppCore
svgs["/svg/my-worktable.svg"]=MyWorkTile
svgs["/svg/more-app.svg"]=MoreApp

export function regSvg(path,component){
    svgs[path]=component
}

export function getSvg(path){
    return svgs[path]
}