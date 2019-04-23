
import React,{ Component } from 'react'
import ReactDOM from "react-dom"
import {ModalSheetManager} from '../app/modelView/ModalSheetManager'

let _overlayWaiter
export function showGlobalOverlay(){
    _overlayWaiter=ModalSheetManager.openWaiting()
}

export function hideGlobalOverlay(){
    _overlayWaiter&&_overlayWaiter()
    _overlayWaiter=null
}