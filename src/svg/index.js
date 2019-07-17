import  { ReactComponent as CorpPartners }  from '../svg/corp-partners.svg'
import  { ReactComponent as CorpRoleMag }  from '../svg/corp-role-mag.svg'
import  { ReactComponent as CorpAppCore }  from '../svg/core-app.svg'
import {ReactComponent as MyWorkTile} from '../svg/my-worktable.svg'
import {ReactComponent as MoreApp} from '../svg/icon-more.svg'
import {ReactComponent as DepartmentApp} from '../svg/department-app.svg'
import {ReactComponent as ProductApp} from '../svg/product-app.svg'
import {ReactComponent as ProductAppMag} from '../svg/product-app-mag.svg'
import {ReactComponent as ProductAppAttr} from '../svg/product-app-attr.svg'
import {ReactComponent as ProductAppUnit} from '../svg/product-app-unit.svg'
const svgs={
    
}
//TODO  load dynamic svg by server config
svgs["/svg/corp-partners.svg"]=CorpPartners
svgs["/svg/corp-role-mag.svg"]=CorpRoleMag
svgs["/svg/core-app.svg"]=CorpAppCore
svgs["/svg/my-worktable.svg"]=MyWorkTile
svgs["/svg/more-app.svg"]=MoreApp
svgs["/svg/department-app.svg"]=DepartmentApp
svgs["/svg/product-app.svg"]=ProductApp
svgs["/svg/product-app-mag.svg"]=ProductAppMag
svgs["/svg/product-app-attr.svg"]=ProductAppAttr
svgs["/svg/product-app-unit.svg"]=ProductAppUnit
export function regSvg(path,component){
    svgs[path]=component
}

export function getSvg(path){
    return svgs[path]
}