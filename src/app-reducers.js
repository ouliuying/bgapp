import {partner} from './reducers/partner'
import {sys} from './reducers/sys'
import {config} from './reducers/config'
import {appContext} from './app/reducers/appContext'
import {appInContainer} from './app/reducers/appInContainer'
import {modalSheetQueue} from './app/reducers/modalSheetQueue'
import {appModelViewDataStore} from './app/reducers/appModelViewDataStore'
import {chat} from './bgchat/reducers/chat'
export default { 
    partner,
    sys,
    config,
    appContext,
    appInContainer,
    modalSheetQueue,
    chat,
    appModelViewDataStore
}