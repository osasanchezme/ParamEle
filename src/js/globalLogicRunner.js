import state from "../state";
import library from "../flow-nodes/handler";

function run() {
  let model = state.getState()["model"];
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
  console.log(`Model has ${nodes.length} nodes and ${edges.length} edges`);
  console.log(connected_nodes);
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
      nodes[nodes_i[node_id]]["data"][res_id] = res_val;
    });
  });
  
  // Update the whole ReactFlow
  let rf_instance = state.getRfInstance();
  rf_instance.setNodes(nodes);
}

const logic_runner = { run };

export default logic_runner;
