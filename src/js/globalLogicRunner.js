import state from "../state";
import getState from "../getState";
import library from "../flow-nodes/handler";
import utils from "../utils";

function run() {
  let model = getState("model");
  let nodes = model.nodes;
  let edges = model.edges;
  let connected_nodes = {};
  let nodes_type = {};
  let nodes_data = {};
  let nodes_i = {};
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
    connected_nodes[edge.target]["args"][edge.targetHandle] = null;
    connected_nodes[edge.target]["sources"][edge.targetHandle] = [edge.source, edge.sourceHandle];
  });
  let structure = utils.getEmptyStructuralModel();
  // Run all the logic
  Object.entries(connected_nodes).forEach(([node_id, node]) => {
    // TODO - Make it an actual logic, gathering all the args first
    // Get the arguments
    Object.entries(node.sources).forEach(([arg_key, [source_node_id, source_data_key]]) => {
      node.args[arg_key] = nodes_data[source_node_id][source_data_key];
    });
    // Execute
    let result = library.execution[nodes_type[node_id]](node.args);
    Object.entries(result).forEach(([res_id, res_val]) => {
      let actual_res_val = JSON.parse(JSON.stringify(res_val));
      // Process the structure
      let res_type = res_id.split("-")[0];
      if (res_type === "node" || res_type === "member"){
        let structure_key = res_type + "s";
        actual_res_val = utils.nextStructuralId(structure_key, structure);
        // Update the structure
        structure[structure_key][actual_res_val] = res_val;
      }
      // Update the node data
      nodes[nodes_i[node_id]]["data"][res_id] = actual_res_val;
    });
  });
  // Update the whole ReactFlow
  let rf_instance = state.getRfInstance();
  rf_instance.setNodes(nodes);
  // Update the structure
  state.setState(structure, "structure");
}

const logic_runner = { run };

export default logic_runner;