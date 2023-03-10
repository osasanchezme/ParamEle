# ParamEle

An open-source node based editor for graphical programming.

## Aspects for the docs

- [ ] Three places where app-related data is stored    
    - [ ] The native state of the ParamEle component -- Used to control and handle state-based behaviors of the app.
    - [ ] The local independent state of the app that syncs with the ReactFlow editor nodes and edges and the settings, also the structure and the globals (`ParamEle.state`) -- Some keys here go to the file exported by the user (settings and model).

- [ ] For adding a new structural node
    - [ ] Create the node renderer itself
    - [ ] Create the execution function for the node
    - [ ] Handle how it is added to the global structural model in the global Logic Runner
    - [ ] Add it to the handler of nodes
    - [ ] Add support for it in the renderer itself (Plotly.js)

