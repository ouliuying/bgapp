
import React,{ Component } from 'react'
import {
    withRouter,
    Redirect,
    Switch,
    Route,
    matchPath
} from 'react-router'
import {ReactReduxContext} from 'react-redux'
import ModalSheetQueueContainer from './app/modelView/ModalSheetQueueContainer'
import {connect} from 'react-redux'

import Login from './Login'

import PropTypes from 'prop-types'
import AppRoute from './AppRoute'
import LoadingFromServer from './LoadingFromServer'

import {statusSelector} from './reducers/partner'
import AppFrame from './AppFrame'
class App extends Component {
    componentWillMount(){
      
    }
    componentDidMount(){
       
    }
    static propTypes = {
        store: PropTypes.object,
    }


    static contextTypes = {
        store: PropTypes.object,
    }

    
    isLogin(){
        return this.props.status>0
    }
    render() {
        //return this.isLogin()?(<AppFrame/>):(<Login/>)
        return <ReactReduxContext.Consumer>
            {
                context=>{

                    return <><Switch>
                    <Route exact path="/" render={ props=>
                        this.isLogin()?(<Redirect to={{
                            pathname: "/app",
                            state: { from: props.location }
                          }}></Redirect>):(<Redirect to={{
                            pathname: "/login",
                            state: { from: props.location }
                          }}></Redirect>)
                    }/>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/app" render={
                        props=>
                        this.isLogin()?(<AppFrame/>):(<Redirect to={{
                            pathname: "/login",
                            state: { from: props.location }
                          }}></Redirect>)
                    }></Route>
                </Switch>
                <ModalSheetQueueContainer></ModalSheetQueueContainer>
                    
        </>
                }
            
            }
            </ReactReduxContext.Consumer>
            
    }
}
function mapStateToProps(state){
   return statusSelector(state)
}
export default withRouter(connect(mapStateToProps)(App))
