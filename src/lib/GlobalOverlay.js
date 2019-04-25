
import React,{ Component } from 'react'
import ReactDOM from "react-dom"
import {ModalSheetManager} from '../app/modelView/ModalSheetManager'

export function showGlobalOverlay(){
    let overlayWaiter=ModalSheetManager.openWaiting()
    return function(){
        hideGlobalOverlay(overlayWaiter)
    }
}

export function hideGlobalOverlay(overlayouWaiter){
    overlayouWaiter&&overlayouWaiter()
}