
function getRecordValue(record,fieldName){
    let v =undefined
    if(record===undefined || record===null){
        return v
    }
    if(fieldName.indexOf(".")<0){
        v = record[fieldName]
    }
    else{
        let deepFields = fieldName.split(".")
        let obj = record
        for(let subField of deepFields){
            
           v= obj[subField]
           if(v &&v.app && v.model && v.record){
             v=v.record
           }
           if(v==undefined || v==null){
               break;
           }
           obj = v
        }
    }
    if(v==="null"){
        return null
    }
    if(v==="undefined"){
        return undefined
    }
    return v
}
function getTestValue(tv){
    if(tv==="undefined"){
        return undefined
    }
    else if(tv==="null"){
        return null
    }
    else {
        return tv
    }
}
const ViewFieldCirteriaOperator=[
    {
        name:"or",
        symbols:[],
        test:(exp,startIndex)=>{
            for(let s of ["or","或","||"]){
                let ss = ` ${s} `
                if(exp.indexOf(ss,startIndex)===startIndex){
                    return ss.length
                }
            }
            return 0
        }
    },
    {
        name:"and",
        symbols:[],
        test:(exp,startIndex)=>{
             for(let s of ["and","并","与","&&"]){
                let ss = ` ${s} `
                if(exp.indexOf(ss,startIndex)===startIndex){
                    return ss.length
                }
            }
            return 0
        }
    },
    {
        name:"no_eq",
        symbols:["!=","<>","不等"],
        test:(record,fieldName,testValue)=>{
            let v = getRecordValue(record,fieldName)
            return v!=testValue
        }
    },
    {
        name:"eq",
        index:1,
        symbols:["=","eq","等于","相同"],
        test:(record,fieldName,testValue)=>{
            let v = getRecordValue(record,fieldName)
            let tv=getTestValue(testValue)
            return v == tv
        }
    },
    {
        name:"gt",
        symbols:[">","大于"],
        test:(record,fieldName,testValue)=>{
            let v = getRecordValue(record,fieldName)
            let tv=getTestValue(testValue)
            return v > tv
        }
    },
    {
        name:"lt",
        symbols:["<","小于"],
        test:(record,fieldName,testValue)=>{
            let v = getRecordValue(record,fieldName)
            let tv=getTestValue(testValue)
            return v < tv
        }
    },
    {
        name:"gt_eq",
        symbols:[">=","大于等于"],
        test:(record,fieldName,testValue)=>{
            let v = getRecordValue(record,fieldName)
            let tv=getTestValue(testValue)
            return v >=tv
        }
    },
    {
        name:"lt_eq",
        symbols:["<=","小于等于"],
        test:(record,fieldName,testValue)=>{
            let v = getRecordValue(record,fieldName)
            let tv=getTestValue(testValue)
            return v <=tv
        }
    },
    {
        name:"in",
        symbols:["in","包含在"],
        test:(record,fieldName,testValue)=>{
            if(testValue instanceof Array){
                let v = getRecordValue(record,fieldName)
                let tv=getTestValue(testValue)
                return tv.indexOf(v)>-1
            }
            else{
                return false
            }
        }
    }
    ,
    {
        name:"not_in",
        symbols:["not in","不包含在"],
        test:(record,fieldName,testValue)=>{
            if(testValue instanceof Array){
                let v = getRecordValue(record,fieldName)
                let tv=getTestValue(testValue)
                return tv.indexOf(v)<0
            }
            else{
                return true
            }
        }
    },
    {
        name:"const",
        symbols:["true","false","是","否","1","0"],
        test:(record,cValue)=>{
            if(/(false)|[0]|[否]/i.test(cValue)){
                return false
            }
            return true
        }
    },
    {
        name:"none",
        symbols:[],
        test:(record)=>{
            return true
        }
    }
]
const ExprKeyword={
    LEFT_BRACKET:"("
}
export const createCriteria=(expr)=>{
  return createCriteriaImp({expr})
}

export const testCriteria=(criterias,record)=>{
    let ret = undefined
    let lastSymbal = undefined
    if(criterias instanceof Array){
        for(let c of criterias){
           //ret = testCriteria(c.criteria,record)
           if(lastSymbal==="or"){
                ret = ret || testCriteria(c.criteria,record)
                lastSymbal = c.op
           }
           else if(lastSymbal==="and"){
            ret = ret && testCriteria(c.criteria,record)
            lastSymbal = c.op
           }    
           else{
                ret = testCriteria(c.criteria,record)
                lastSymbal = c.op
           }
        }
    }
    else{
        ret = criterias.test(record)
    }
    return ret
}
function createCriteriaImp(expr){
    if(expr.expr==="" || 
        expr.expr===undefined || 
        expr.expr===null){
        return  {op:"none",test:()=>true}
    }
    let exprLogicTokens = createSamePriorityExprLogicToken(expr)
    try
    {
        if(exprLogicTokens.length>1){
            let criterias = []
            for(let et of exprLogicTokens){
                let criteria = createCriteriaImp({expr:et.expr})
                criterias.push({
                    op:et.symbol,
                    criteria:criteria
                })
            }
            return criterias
        }
        else if(exprLogicTokens.length===1){
            if(exprLogicTokens[0].expr.indexOf(ExprKeyword.LEFT_BRACKET)===0){
                let subExpr = exprLogicTokens[0].expr.substr(1,exprLogicTokens[0].expr.length-2)
                return createCriteriaImp({
                    expr:subExpr
                })
            }
            else{
                let  op = ViewFieldCirteriaOperator.find(x=>{
                    if(x.symbols.length<1){
                        return false
                    }
                    let rr = x.symbols.join("|")
                    let rj = `^([a-zA-A][a-zA-Z0-9\\.]{0,255})(\\s+)?(${rr})(\\s+)?([\\s\\S]*)`
                    if(new RegExp(rj).test(exprLogicTokens[0].expr)){
                        return true
                    }
                })
                if(op){
                    let pName = RegExp.$1
                    let pValue=RegExp.$5
                    return {
                        op:op.name,
                        test:(record)=>{
                            return op.test(record,pName,pValue)
                        }
                    }
                }
                else{
                    let constOp = ViewFieldCirteriaOperator.find(x=>x.name==="const")
                    return {op:constOp.name,test:(record)=>{
                        constOp.test(record,exprLogicTokens[0].expr)
                    }}
                }
            }
        }
        else{
            return  {op:"none",test:()=>true}
        }
    }
    catch(err) {
        console.log(err)
    }
    return  {op:"none",test:()=>true}
}
function createSamePriorityExprLogicToken(expr){
    let subExprs=[]
    let leftBracketCount = 0
    let inStringModel = false
    let count = expr.expr.length
    let orOp = ViewFieldCirteriaOperator.find(x=>x.name==="or")
    let andOp = ViewFieldCirteriaOperator.find(x=>x.name==="and")
    let fromIndex=0
    for(let index=0;index<count;index++){
        let c = expr.expr[index]
        if(!inStringModel){
            if(c==="("){
                leftBracketCount = leftBracketCount + 1
            }
            else if(c===")"){
                leftBracketCount = leftBracketCount + 1
            }
            else if(index<(count-1) && c==="'" && expr.expr[index+1]!=="'"){
                inStringModel=true
            }
            else if(leftBracketCount===0){
                let matchCount = orOp.test(expr.expr,index)
                if(matchCount>0){
                    subExprs.push({
                        symbol:orOp.name,
                        expr:expr.expr.substring(fromIndex,index).trim()
                    })
                    index = index+matchCount
                    fromIndex = index
                }
                else{
                    matchCount = andOp.test(expr.expr,index)
                    if(matchCount>0){
                        subExprs.push({
                            symbol:andOp.name,
                            expr:expr.expr.substring(fromIndex,index).trim()
                        })
                        index = index+matchCount
                        fromIndex = index
                    }
                }
            }
        }
        else{
            if(index<(count-1) && c==="'" && expr.expr[index+1]!=="'"){
                inStringModel=false
            }
            else if(index===count-1){
                inStringModel=false
            }
            else if(index<(count-1) && c==="'" && expr.expr[index+1]==="'"){
                index= index+1
            }
        }
        if(index===count-1){
            subExprs.push({
                expr:expr.expr.substring(fromIndex,count).trim()
            })
        }
    }
    return subExprs
}


