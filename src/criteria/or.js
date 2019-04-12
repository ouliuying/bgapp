import {OR} from './expType'
function or(){
    var criteriaArray=[]
    for(var c of arguments){
        criteriaArray.push(c)
    }
    return {
        op:OR,
        exp:criteriaArray
    }
}

export {or}