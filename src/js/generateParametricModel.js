import { addEdgesArrayToTheEditor, addNodesArrayToTheEditor, addNodeToTheEditor, fitView, getZoom } from "../components/VisualEditor";
import utils from "../utils";

/**
 * Generates a parametric model in the reactflow editor starting from an S3D model
 * @param {import("../submodules/paramele-parsers/types").s3d_model} s3d_model
 * @returns
 */
const generateParametricModel = (s3d_model) => {
  let zoom = getZoom();
  let x_orig = -1500;
  let y_orig = -1500;
  let number_nodes = 0;
  let master_spacing = 50 * (zoom / 0.5); // Normalize the spacing so it is independent of the zoom level

  const paramele_interface = {
    /** @type {Object.<string, {coords: {x: number, y: number}, nodes_list: object[], maps: Object.<string, number>}>} */
    nodes: {
      parameters: { coords: { x: x_orig, y: y_orig }, nodes_list: [], maps: {} },
      nodes: { coords: { x: x_orig + 3 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
      members: { coords: { x: x_orig + 6 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
      plates: { coords: { x: x_orig + 9 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
      supports: { coords: { x: x_orig + 12 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
      distributed_loads: { coords: { x: x_orig + 15 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
      point_loads: { coords: { x: x_orig + 18 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
      moments: { coords: { x: x_orig + 21 * master_spacing, y: y_orig }, nodes_list: [], maps: {} },
    },
    edges: [],
    addInputNode: (custom_label, value) => {
      paramele_interface.addNode("parameters", "inputNumber", custom_label, { "value-value": value });
    },
    addStringNode: (custom_label, value) => {
      paramele_interface.addNode("parameters", "inputString", custom_label, { "value-string": value });
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
    /**
     *
     * @param {*} elements_collection
     * @param {Object.<string, {type: "value"|"string", target_handle: string, data: Object.<string, string[]>}>} parameters
     * @param {*} dependencies
     * @param {*} param3
     */
    addNodesAndEdgesFromParameters: (
      elements_collection,
      parameters,
      dependencies,
      { elements_group_name, elements_node_type, elements_node_spacing }
    ) => {
      Object.entries(parameters).forEach(([parameter_name, parameter_object], parameter_index) => {
        Object.entries(parameter_object.data).forEach(([parameter_value, element_ids], sub_parameter_index) => {
          // Define the nodes with the parameters (number or string)
          let sub_parameter_id = `${utils.getDisplayCopy("tags", parameter_name).toUpperCase()}-${sub_parameter_index + 1} (${utils.getDisplayCopy("nodes", elements_node_type).toUpperCase()})`;
          switch (parameter_object.type) {
            case "string":
              paramele_interface.addStringNode(sub_parameter_id, parameter_value);
              break;
            case "value":
              paramele_interface.addInputNode(sub_parameter_id, parameter_value);
              break;
            default:
              throw new Error(`Unknown parameter type ${parameter_object.type} for parameter ${parameter_name}`);
          }

          // Define the structural nodes
          if (parameter_index == 0) {
            element_ids.forEach((element_id) => {
              paramele_interface.addNode(elements_group_name, elements_node_type, element_id, undefined, elements_node_spacing);

              // Connect the dependencies with the recently added structural nodes
              dependencies.forEach(({ key, group_name, target_handle, source_handle, multi_source_function }) => {
                let sources_list =
                  multi_source_function == undefined
                    ? [elements_collection[element_id][key]]
                    : multi_source_function(elements_collection[element_id][key]);

                sources_list.forEach((source_id) => {
                  paramele_interface.addEdge(
                    { group_name, map_key: source_id },
                    source_handle,
                    { group_name: elements_group_name, map_key: element_id },
                    target_handle
                  );
                });
              });
            });
            paramele_interface.spaceNodesGroup(elements_group_name);
          }

          // Connect the parameters with the structural node
          element_ids.forEach((element_id) => {
            paramele_interface.addEdge(
              { group_name: "parameters", map_key: sub_parameter_id },
              `value-${parameter_object.type}`,
              { group_name: elements_group_name, map_key: element_id },
              parameter_object.target_handle
            );
          });
        });
        paramele_interface.spaceNodesGroup("parameters");
      });
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
  let { nodes, members, plates, supports, distributed_loads, point_loads, moments } = s3d_model;
  // Process the nodes by faces
  let nodes_faces = findParameters(nodes, { x: {}, y: {}, z: {} });
  let nodes_dependencies = [];
  paramele_interface.addNodesAndEdgesFromParameters(nodes, nodes_faces, nodes_dependencies, {
    elements_group_name: "nodes",
    elements_node_type: "structuralNode",
    elements_node_spacing: 1.5,
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
  let plates_thicknesses = findParameters(plates, { thickness: {} });
  let plates_dependencies = [
    {
      key: "nodes",
      group_name: "nodes",
      target_handle: "nodes-ids",
      source_handle: "node_out-id",
      multi_source_function: (element_data) => element_data.split(","),
    },
  ];
  paramele_interface.addNodesAndEdgesFromParameters(plates, plates_thicknesses, plates_dependencies, {
    elements_group_name: "plates",
    elements_node_type: "structuralPlate",
    elements_node_spacing: 1.5,
  });

  // Process the supports by fixity code
  let supports_restraints = findParameters(supports, { restraint_code: { type: "string", target_handle: "restraint_code-string-FFFFFF" } });
  let supports_dependencies = [{ key: "node", group_name: "nodes", target_handle: "node-id", source_handle: "node_out-id" }];
  paramele_interface.addNodesAndEdgesFromParameters(supports, supports_restraints, supports_dependencies, {
    elements_group_name: "supports",
    elements_node_type: "structuralGenericSupport",
    elements_node_spacing: 1.5,
  });

  // Process the distributed loads by magnitude
  paramele_interface.spaceNodesGroup("parameters");
  let dl_magnitudes = findParameters(distributed_loads, {
    x_mag_A: {},
    y_mag_A: {},
    z_mag_A: {},
    x_mag_B: {},
    y_mag_B: {},
    z_mag_B: {},
  });
  let dl_dependencies = [{ key: "member", group_name: "members", target_handle: "member-id", source_handle: "member_out-id" }];
  paramele_interface.addNodesAndEdgesFromParameters(distributed_loads, dl_magnitudes, dl_dependencies, {
    elements_group_name: "distributed_loads",
    elements_node_type: "structuralDistributedLoad",
    elements_node_spacing: 2,
  });

  // Process the point loads by magnitude
  paramele_interface.spaceNodesGroup("parameters");
  let pl_magnitudes = findParameters(point_loads, {
    x_mag: {},
    y_mag: {},
    z_mag: {},
  });
  let pl_dependencies = [{ key: "node", group_name: "nodes", target_handle: "node-id", source_handle: "node_out-id" }];
  paramele_interface.addNodesAndEdgesFromParameters(point_loads, pl_magnitudes, pl_dependencies, {
    elements_group_name: "point_loads",
    elements_node_type: "structuralPointLoad",
    elements_node_spacing: 1.5,
  });

  // Process the moments by magnitude
  paramele_interface.spaceNodesGroup("parameters");
  let moments_magnitudes = findParameters(moments, {
    x_mag: {},
    y_mag: {},
    z_mag: {},
  });
  let moments_dependencies = [{ key: "node", group_name: "nodes", target_handle: "node-id", source_handle: "node_out-id" }];
  paramele_interface.addNodesAndEdgesFromParameters(moments, moments_magnitudes, moments_dependencies, {
    elements_group_name: "moments",
    elements_node_type: "structuralMoment",
    elements_node_spacing: 1.5,
  });

  // Add everything to the editor
  addNodesArrayToTheEditor(paramele_interface.getAllNodes());
  addEdgesArrayToTheEditor(paramele_interface.getAllEdges());
  // TODO - Improve this temporal fix to ensure the Visual Editor doesn't break
  setTimeout(() => {
    fitView();
  }, 3000);
};

/**
 *  Groups items of an object by shared keys
 * @param {{[string]: {[string]: number}}} source_obj - Any object with multiple keys of the same kind which are groupable by some second level keys
 * @param {Object.<string, {type: "value"|"string", target_handle: string, data: Object.<string, string[]>}>} parameters_obj - Object in which to store the parameters, Each key in the object will be populated by the shared parameters
 */
const findParameters = (source_obj, parameters_obj) => {
  Object.entries(source_obj).forEach(([element_id, element_data]) => {
    Object.keys(parameters_obj).forEach((parameter_name) => {
      let parameter_value = element_data[parameter_name];
      if (parameters_obj[parameter_name].type == undefined) parameters_obj[parameter_name].type = "value";
      // If undefined fill the target handle with the predefined name-type
      if (parameters_obj[parameter_name].target_handle == undefined)
        parameters_obj[parameter_name].target_handle = `${parameter_name}-${parameters_obj[parameter_name].type}`;
      if (parameters_obj[parameter_name].data == undefined) parameters_obj[parameter_name].data = {};
      if (!parameters_obj[parameter_name].data[parameter_value]) {
        parameters_obj[parameter_name].data[parameter_value] = [];
      }
      parameters_obj[parameter_name].data[parameter_value].push(element_id);
    });
  });
  return parameters_obj;
};

export default generateParametricModel;
