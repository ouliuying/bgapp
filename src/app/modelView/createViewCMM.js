
import {ViewCMMRegistry} from '../cmm/ViewCMMRegistry'
export const createViewCMM = (app,model,viewType)=>{
  let cmmCls = ViewCMMRegistry.getCMM(app,model,viewType)
  return new cmmCls(app,model,viewType)
}