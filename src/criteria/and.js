
 import {AND} from './expType';
function and(){
    var criteriaArray=[]
    for(var c of arguments){
        criteriaArray.push(c)
    }
    return {
        "__type__":AND,
        exp:criteriaArray
    }
}

export {and}
