import {req,APPLICATION_JSON} from '../../lib/http-helper'
 export class ModelAction{
    constructor(app,model){
        this.app=app
        this.model=model
    }
    call(action,opts,success,fail){
        var url=`/ac/${this.app}/${this.model}/${action}`
        success=success||function(){}
        fail=fail||function(){}
        req(url,opts,{
            headers: {
                'content-type': APPLICATION_JSON
            }
        },function(res){
            success(JSON.parse(res))
        },function(err){
            console.error(err)
            fail(err)
        })
    }
    
    read({
        app=this.app,
        model=this.model,
        fields=[],
        fieldClause={},
        modelClause={},
        pageSize=10,
        pageIndex=1,
        orderByFields=[]
    }={},success,fail){
        var url=`/ac/${this.app}/${this.model}/read`
        success=success||function(){}
        fail=fail||function(){}
        req(url,{
            app,
            model,
            fields,
            fieldClause,
            modelClause,
            pageSize,
            pageIndex,
            orderByFields
        },
        {
            headers: {
                'content-type': APPLICATION_JSON
            }
        },function(res){
            success(JSON.parse(res))
        },function(err){
            console.error(err)
            fail(err)
        })
    }
}