
import {CRITERIA} from './expType'
import {CONSTANT} from './valueType'
export {and} from './and'
export {or} from './or'


function nameValueCriteria(name,operator,value,valueType=CONSTANT){
    return {
        op:CRITERIA,
        exp:[name,operator,value,valueType]
    }
}

export function eq(name,value,valueType=CONSTANT){
    return nameValueCriteria(name,"=",value,valueType)
}



export function gt(name,value,valueType=CONSTANT){
    return nameValueCriteria(name,">",value,valueType)
}

export function lt(name,value,valueType=CONSTANT){
    return nameValueCriteria(name,"<",value,valueType)
}


export function gt_eq(name,value,valueType=CONSTANT){
    return nameValueCriteria(name,">=",value,valueType)
}

export function lt_eq(name,value,valueType=CONSTANT){
    return nameValueCriteria(name,"<=",value,valueType)
}

export function iLike(name,value,valueType=CONSTANT){
    return nameValueCriteria(name,"ilike",value,valueType)
}

export function like(name,value,valueType=CONSTANT){
    return nameValueCriteria(name,"like",value,valueType)
}

