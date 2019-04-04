import React from 'react'

const HookContext= React.createContext({cmmHost:null,parent:null},(pre,next)=>{
    //console.log(JSON.stringify(pre)+"========>"+JSON.stringify(next))
    return 1
})
export default HookContext