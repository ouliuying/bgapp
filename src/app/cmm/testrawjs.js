    function getInfo(){
                app = getApp(function(app){
                    alert(app);
                    if(app!=""){
                        let data = {appName: app};
                        fetch("/smc-gw/V2/portrait/apps", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        }).then(res=>res.json()).then(res => {
                            writeApp({
                            app:app,
                            res:JSON.stringify(res)
                            },function(){
                                getInfo();
                            });
                           
                        }).catch(res=>{
                            alert(res.message);
                            getInfo();
                        });
                    }
                    else{
                            alert("结束。。。。。。。。。。。。。。。。。。。。。。。");
                    }
                });
            }