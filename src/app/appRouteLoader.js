import {showGlobalOverlay,hideGlobalOverlay} from "../lib/GlobalOverlay"
export default function appRouteLoader(opts){
    const {loader,start,done,fail}=opts
    if(start instanceof Function){
        start()
    }
    showGlobalOverlay()
    let promise=loader()
    promise.then(function(routeLoader){
        if(done instanceof Function){
            done(routeLoader())
        }
        hideGlobalOverlay()
    }).catch(function(err){
        if(fail instanceof Function){
            fail(err)
        }
        hideGlobalOverlay()
    })
}