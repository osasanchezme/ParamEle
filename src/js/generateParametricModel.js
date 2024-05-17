import { addEdgesArrayToTheEditor, addNodesArrayToTheEditor, addNodeToTheEditor } from "../components/VisualEditor";
import utils from "../utils";

/**
 * Generates a parametric model in the reactflow editor
 * @param {import("../submodules/paramele-parsers/types").s3d_model} s3d_model
 * @returns
 */
const generateParametricModel = (s3d_model) => {
  let { nodes } = s3d_model;
  let faces = findFaces(nodes);
  let x_orig = 100;
  let y_orig = 100;
  let number_nodes = 0;
  let master_spacing = 50;
  let paramele_model_nodes_coordinates = [];
  let paramele_model_nodes_structural_nodes = [];

  let paramele_model_edges = [];

  let column_1_x_acc = x_orig;
  let column_1_y_acc = y_orig;

  let column_2_x_acc = x_orig + 3 * master_spacing;
  let column_2_y_acc = y_orig;

  let structural_node_to_paramele_node_map = {};
  Object.entries(faces).forEach(([face_axis, face_object]) => {
    Object.entries(face_object).forEach(([face_value, { node_ids }], face_i) => {
      // Define the nodes with the coordinate numbers
      number_nodes += 1;
      column_1_y_acc += master_spacing;
      paramele_model_nodes_coordinates.push(
        addNodeToTheEditor(
          "inputNumber",
          { x: column_1_x_acc, y: column_1_y_acc },
          { "value-value": face_value, custom_label: `${face_axis.toUpperCase()}-${face_i + 1}` },
          false,
          false,
          number_nodes
        )
      );
      let paramele_number_node_id = utils.getNodeFullID(number_nodes);
      // Define the nodes with the nodes themselves
      if (face_axis == "x") {
        node_ids.forEach((node_id) => {
          number_nodes += 1;
          column_2_y_acc += master_spacing * 2;
          paramele_model_nodes_structural_nodes.push(
            addNodeToTheEditor("structuralNode", { x: column_2_x_acc, y: column_2_y_acc }, { custom_label: `${node_id}` }, false, false, number_nodes)
          );
          structural_node_to_paramele_node_map[node_id] = utils.getNodeFullID(number_nodes);
        });
        column_2_y_acc += master_spacing;
      }
      // Define the edges connecting the coordinate numbers with the structural nodes
      node_ids.forEach((node_id) => {
        let source = paramele_number_node_id;
        let sourceHandle = "value-value";
        let target = structural_node_to_paramele_node_map[node_id];
        let targetHandle = `${face_axis}-value`;
        paramele_model_edges.push({
          id: `reactflow__edge-${source}${sourceHandle}__${target}${targetHandle}`,
          source,
          sourceHandle,
          target,
          targetHandle,
        });
      });
    });
    column_1_y_acc += master_spacing;
  });
  addNodesArrayToTheEditor([...paramele_model_nodes_coordinates, ...paramele_model_nodes_structural_nodes]);
  addEdgesArrayToTheEditor([...paramele_model_edges])
};

/**
 * Groups the nodes by faces in a plane perpendicular to each axis
 * @param {import("../submodules/paramele-parsers/types").s3d_nodes_object} nodes
 * @return {Object.<string, Object.<number, {node_ids: number[]}>>}
 */
const findFaces = (nodes) => {
  let faces = {
    x: {},
    y: {},
    z: {},
  };
  Object.entries(nodes).forEach(([node_id, node_coords]) => {
    Object.entries(node_coords).forEach(([coord_name, coord_value]) => {
      if (!faces[coord_name][coord_value]) {
        faces[coord_name][coord_value] = { node_ids: [] };
      }
      faces[coord_name][coord_value].node_ids.push(node_id);
    });
  });
  return faces;
};

export default generateParametricModel;
