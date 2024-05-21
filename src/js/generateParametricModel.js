import { addEdgesArrayToTheEditor, addNodesArrayToTheEditor, addNodeToTheEditor, getZoom } from "../components/VisualEditor";
import utils from "../utils";

/**
 * Generates a parametric model in the reactflow editor starting from an S3D model
 * @param {import("../submodules/paramele-parsers/types").s3d_model} s3d_model
 * @returns
 */
const generateParametricModel = (s3d_model) => {
  let zoom = getZoom();
  let x_orig = 100;
  let y_orig = 100;
  let number_nodes = 0;
  let master_spacing = 50 * (zoom / 0.5); // Normalize the spacing so it is independent of the zoom level

  const paramele_interface = {
    /** @type {Object.<string, {coords: {x: number, y: number}, nodes_list: object[], maps: Object.<string, number>}>} */
    nodes: {
      parameters: { coords: { x: x_orig, y: y_orig }, nodes_list: [], maps: {} },
      nodes: { coords: { x: x_orig + 3 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
      members: { coords: { x: x_orig + 6 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
      plates: { coords: { x: x_orig + 9 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
    },
    edges: [],
    addInputNode: (custom_label, value) => {
      paramele_interface.addNode("parameters", "inputNumber", custom_label, { "value-value": value });
    },
    spaceNodesGroup: (group_name, spacing_multiplier = 1) => {
      paramele_interface.nodes[group_name].coords.y += master_spacing * spacing_multiplier;
    },
    /**
     *
     * @param {{group_name: string, map_key: string}} source
     * @param {string} sourceHandle
     * @param {{group_name: string, map_key: string}} target
     * @param {string} targetHandle
     */
    addEdge: (source, sourceHandle, target, targetHandle) => {
      if (typeof source == "object") {
        let { group_name, map_key } = source;
        source = paramele_interface.nodes[group_name].maps[map_key];
      }
      if (typeof target == "object") {
        let { group_name, map_key } = target;
        target = paramele_interface.nodes[group_name].maps[map_key];
      }
      paramele_interface.edges.push({
        id: `reactflow__edge-${source}${sourceHandle}__${target}${targetHandle}`,
        source,
        sourceHandle,
        target,
        targetHandle,
      });
    },
    /**
     *
     * @param {string} group_name
     * @param {import("./types").ParamEleNodesTypes} type
     * @param {number|string} element_id
     * @param {object} additional_data
     * @param {number|undefined} spacing_multiplier
     */
    addNode: (group_name, type, element_id, additional_data, spacing_multiplier = 1) => {
      number_nodes += 1;
      paramele_interface.spaceNodesGroup(group_name, spacing_multiplier);
      let custom_label = isNaN(element_id) ? element_id : `${utils.getDisplayCopy("nodes", type)} ${element_id}`;
      let data = { custom_label };
      if (additional_data) Object.assign(data, additional_data);
      paramele_interface.nodes[group_name].nodes_list.push(
        addNodeToTheEditor(
          type,
          { x: paramele_interface.nodes[group_name].coords.x, y: paramele_interface.nodes[group_name].coords.y },
          data,
          false,
          false,
          number_nodes
        )
      );
      let new_node_id = utils.getNodeFullID(number_nodes);
      if (paramele_interface.nodes[group_name].maps[element_id] != undefined)
        throw new Error(`Element id ${element_id} under ${group_name} already taken!`);
      paramele_interface.nodes[group_name].maps[element_id] = new_node_id;
    },
    getAllNodes: () => {
      let all_nodes = [];
      Object.values(paramele_interface.nodes).forEach(({ nodes_list }) => {
        all_nodes.push(...nodes_list);
      });
      return all_nodes;
    },
    getAllEdges: () => {
      return paramele_interface.edges;
    },
  };
  /**
   *
   * @param {import("./types").ParamEleNodesTypes} node_type
   * @param {number} id
   */
  let { nodes, members, plates } = s3d_model;
  // Process the nodes by faces
  let faces = findParameters(nodes, { x: {}, y: {}, z: {} });
  Object.entries(faces).forEach(([face_axis, face_object]) => {
    Object.entries(face_object).forEach(([face_value, node_ids], face_i) => {
      // Define the nodes with the coordinate numbers
      let face_id = `${face_axis.toUpperCase()}-${face_i + 1}`;
      paramele_interface.addInputNode(face_id, face_value);
      // Define the nodes with the nodes themselves
      if (face_axis == "x") {
        node_ids.forEach((node_id) => {
          paramele_interface.addNode("nodes", "structuralNode", node_id, undefined, 1.5);
        });
        paramele_interface.spaceNodesGroup("nodes");
      }
      // Define the edges connecting the coordinate numbers with the structural nodes
      node_ids.forEach((node_id) => {
        paramele_interface.addEdge(
          { group_name: "parameters", map_key: face_id },
          "value-value",
          { group_name: "nodes", map_key: node_id },
          `${face_axis}-value`
        );
      });
    });
    paramele_interface.spaceNodesGroup("parameters");
  });

  // Add the members
  Object.entries(members).forEach(([member_id, { node_A, node_B }]) => {
    paramele_interface.addNode("members", "structuralMember", member_id, undefined, 1.5);
    // Add the edge to node_A
    paramele_interface.addEdge({ group_name: "nodes", map_key: node_A }, "node_out-id", { group_name: "members", map_key: member_id }, "node_A-id");
    // Add the edges to node_B
    paramele_interface.addEdge({ group_name: "nodes", map_key: node_B }, "node_out-id", { group_name: "members", map_key: member_id }, "node_B-id");
  });

  // Process the plates by thickness
  let thicknesses = findParameters(plates, { thickness: {} });
  Object.entries(thicknesses).forEach(([parameter_name, parameter_object], parameter_index) => {
    Object.entries(parameter_object).forEach(([parameter_value, element_ids], sub_parameter_index) => {
      // Define the nodes with the coordinate numbers
      let sub_parameter_id = `${parameter_name.toUpperCase()}-${sub_parameter_index + 1}`;
      paramele_interface.addInputNode(sub_parameter_id, parameter_value);
      // Define the nodes with the nodes themselves
      if (parameter_index == 0) {
        element_ids.forEach((element_id) => {
          paramele_interface.addNode("plates", "structuralPlate", element_id, undefined, 1.5);
        });
        paramele_interface.spaceNodesGroup("plates");
      }
      // Define the edges connecting the coordinate numbers with the structural nodes
      element_ids.forEach((element_id) => {
        paramele_interface.addEdge(
          { group_name: "parameters", map_key: sub_parameter_id },
          "value-value",
          { group_name: "plates", map_key: element_id },
          "thickness-value"
        );
        plates[element_id].nodes.split(",").forEach((node_id) => {
          paramele_interface.addEdge(
            { group_name: "nodes", map_key: node_id },
            "node_out-id",
            { group_name: "plates", map_key: element_id },
            "nodes-ids"
          );
        });
      });
    });
    paramele_interface.spaceNodesGroup("plates");
  });
  // Add everything to the editor
  addNodesArrayToTheEditor(paramele_interface.getAllNodes());
  addEdgesArrayToTheEditor(paramele_interface.getAllEdges());
};

/**
 *  Groups items of an object by shared keys
 * @param {{[string]: {[string]: number}}} source_obj - Any object with multiple keys of the same kind which are groupable by some second level keys
 * @param {{[string]: number[]}} parameters_obj - Object in which to store the parameters, Each key in the object will be populated by the shared parameters
 */
const findParameters = (source_obj, parameters_obj) => {
  Object.entries(source_obj).forEach(([element_id, element_data]) => {
    Object.keys(parameters_obj).forEach((parameter_name) => {
      let parameter_value = element_data[parameter_name];
      if (!parameters_obj[parameter_name][parameter_value]) {
        parameters_obj[parameter_name][parameter_value] = [];
      }
      parameters_obj[parameter_name][parameter_value].push(element_id);
    });
  });
  return parameters_obj;
};

export default generateParametricModel;
