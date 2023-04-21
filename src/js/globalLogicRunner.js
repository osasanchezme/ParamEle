import state from "../state";
import getState from "../getState";
import utils from "../utils";

function run() {
  let model = getState("model");
  // Restart the structure
  state.setState(utils.getEmptyStructuralModel(), "structure");
  let {nodes} = calculateModel(model)
  // Update the whole ReactFlow
  let rf_instance = state.getRfInstance();
  rf_instance.setNodes(nodes);
  // Update the renderer
  utils.updateRenderer();
  // Update the properties panel
  utils.updatePropertiesPanel();
}

/**
 * 
 * @param {object} model - Processes a reactflow model of nodes and edges to calculate their outputs
 */
function calculateModel(model){
  let nodes = model.nodes;
  let edges = model.edges;
  let connected_nodes = {};
  let nodes_type = {};
  let nodes_data = {};
  let nodes_i = {};
  const library = utils.getNodesLibrary();
  // Preprocess nodes
  nodes.forEach((node) => {
    nodes_type[node.id] = node.type;
  });
  nodes.forEach((node) => {
    nodes_data[node.id] = node.data;
  });
  nodes.forEach((node, i) => {
    nodes_i[node.id] = i;
  });
  // Get all the connected nodes in the model
  edges.forEach((edge) => {
    if (!connected_nodes.hasOwnProperty(edge.target))
      connected_nodes[edge.target] = {
        args: {},
        sources: {},
        type: nodes_type[edge.target],
      };
    if (!connected_nodes[edge.target]["sources"].hasOwnProperty(edge.targetHandle)) connected_nodes[edge.target]["sources"][edge.targetHandle] = [];
    connected_nodes[edge.target]["args"][edge.targetHandle] = null;
    connected_nodes[edge.target]["sources"][edge.targetHandle].push({ source_node_id: edge.source, source_handle_id: edge.sourceHandle });
  });
  // Run all the logic
  Object.entries(connected_nodes).forEach(([node_id, node]) => {
    // TODO - Make it an actual logic, gathering all the args first
    // Get the arguments
    Object.entries(node.sources).forEach(([arg_key, arg_data_array]) => {
      let processed_args;
      if (arg_data_array.length > 1) processed_args = [];
      arg_data_array.forEach((arg_obj) => {
        if (arg_data_array.length > 1) processed_args.push(nodes_data[arg_obj.source_node_id][arg_obj.source_handle_id]);
        else processed_args = nodes_data[arg_obj.source_node_id][arg_obj.source_handle_id];
      });
        node.args[arg_key] = processed_args;
    });
    // Execute
    let result = library.execution[nodes_type[node_id]](node.args, nodes_data[node_id]);
    let result_input = {};
    Object.entries(result).forEach(([res_id, res_val]) => {
      let actual_res_val = JSON.parse(JSON.stringify(res_val));
      // Process the structure
      let res_type = utils.splitArgName(res_id, "source").name;
      if (
        res_type === "node" ||
        res_type === "member" ||
        res_type === "support" ||
        res_type === "point_load" ||
        res_type === "distributed_load" ||
        res_type === "plate" ||
        res_type === "moment" ||
        res_type === "section" ||
        res_type === "material"
      ) {
        // For structural nodes
        // Get the global structure
        let structure = getState("structure");
        let structure_key = res_type + "s";
        actual_res_val = utils.nextStructuralId(structure_key, structure);
        // Update the structure
        structure[structure_key][actual_res_val] = res_val;
        // Store the global structure
        state.setState(structure, "structure");
        result_input = res_val;
      }else if (res_type === "result"){
        // For other nodes numerical nodes
        actual_res_val = res_val.value;
        delete res_val.value;
        result_input = res_val;
      }else {
        // For the rest of the nodes (Wrapper)
        result_input = result.input;
      }
      // Update the node data
      nodes[nodes_i[node_id]]["data"][res_id] = actual_res_val;
    });
    // Set the input
    nodes[nodes_i[node_id]]["data"]["input"] = result_input;
  });
  return {nodes}
}

const logic_runner = { run, calculateModel };

export default logic_runner;
