import model from "./data/template-1.json"

const initial_state = {
    model: model,
}

function setInitialState(){
    window.ParamEle = {};
    window.ParamEle.rfInstance = undefined;
    window.ParamEle.state = initial_state;
}

function storeRfInstance(rfInstance){
    window.ParamEle.rfInstance = rfInstance;
}

function getState(){
    return JSON.parse(JSON.stringify(window.ParamEle.state));
}

function setState(state){
    return window.ParamEle.state = JSON.parse(JSON.stringify(state));
}

function getRfInstance(){
    return window.ParamEle.rfInstance;
}

function updateStateFromFlow(){
    let rfInstance = getRfInstance();
    let current_state = getState();
    current_state.model.nodes = rfInstance.getNodes();
    current_state.model.edges = rfInstance.getEdges();
    setState(current_state);
}

const state = {setInitialState, getState, setState, storeRfInstance, updateStateFromFlow, getRfInstance};

export default state;