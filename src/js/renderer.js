import getState from "../getState";
import geom_utils from "../geom_utils";

function getData() {
  let structure = getState("structure");
  let units = getState("model")["units"];
  let plotly_data = [];

  // Add axes
  let axes_length = 2;
  plotly_data.push({
    x: [0, axes_length],
    y: [0, 0],
    z: [0, 0],
    type: "scatter3d",
    mode: "lines",
    hoverinfo: "none",
    line: { width: 5, color: "red" },
  });
  plotly_data.push({
    x: [0, 0],
    y: [0, axes_length],
    z: [0, 0],
    type: "scatter3d",
    mode: "lines",
    hoverinfo: "none",
    line: { width: 5, color: "green" },
  });
  plotly_data.push({
    x: [0, 0],
    y: [0, 0],
    z: [0, axes_length],
    type: "scatter3d",
    mode: "lines",
    hoverinfo: "none",
    line: { width: 5, color: "blue" },
  });

  // Add nodes
  let nodes = {
    x: [],
    y: [],
    z: [],
    type: "scatter3d",
    mode: "markers",
    marker: { color: "#003CA0", size: 4 },
    text: [],
    hovertemplate: "%{text} (%{x}, %{y}, %{z})<extra></extra>",
  };
  Object.entries(structure.nodes).forEach(([node_id, node_data]) => {
    nodes.x.push(node_data.x);
    nodes.y.push(node_data.y);
    nodes.z.push(node_data.z);
    nodes.text.push("Nodo " + node_id);
  });
  plotly_data.push(nodes);

  // Members
  let selection_nodes = {
    x: [],
    y: [],
    z: [],
    type: "scatter3d",
    mode: "markers",
    marker: { color: "#ACADAE", size: 3 },
    text: [],
    hovertemplate: "%{text} <extra></extra>",
  };
  Object.entries(structure.members).forEach(([member_id, member_data]) => {
    let member = { x: [], y: [], z: [], type: "scatter3d", mode: "lines", hoverinfo: "none", line: { width: 3, color: "#ACADAE" } };
    // Node A
    let node_A = structure.nodes[member_data.node_A];
    member.x.push(node_A.x);
    member.y.push(node_A.y);
    member.z.push(node_A.z);
    // Node B
    let node_B = structure.nodes[member_data.node_B];
    member.x.push(node_B.x);
    member.y.push(node_B.y);
    member.z.push(node_B.z);

    plotly_data.push(member);

    let member_length = Math.sqrt((node_A.x - node_B.x) ** 2 + (node_A.y - node_B.y) ** 2 + (node_A.z - node_B.z) ** 2);
    let member_label = `Elemento  ${member_id} (${member_length} ${units.length})`;

    // Selection nodes along the member
    let node_middle = { x: (node_A.x + node_B.x) / 2, y: (node_A.y + node_B.y) / 2, z: (node_A.z + node_B.z) / 2 };
    selection_nodes.x.push(node_middle.x);
    selection_nodes.y.push(node_middle.y);
    selection_nodes.z.push(node_middle.z);
    selection_nodes.text.push(member_label);
  });
  plotly_data.push(selection_nodes);

  // Supports
  Object.entries(structure.supports).forEach(([support_id, support_data]) => {
    let support = {
      x: [],
      y: [],
      z: [],
      type: "scatter3d",
      mode: "lines",
      hoverinfo: "none",
      line: { width: 2, color: "black" },
    };
    let node = structure.nodes[support_data.node];
    let support_coords = createSupport(support_data.restraint_code, node);
    support.x.push(...support_coords.support_x);
    support.y.push(...support_coords.support_y);
    support.z.push(...support_coords.support_z);
    plotly_data.push(support);
  });

  // Point loads
  Object.entries(structure.point_loads).forEach(([pl_id, pl_data]) => {
    let pl = {
      x: [],
      y: [],
      z: [],
      type: "scatter3d",
      mode: "lines",
      hoverinfo: "none",
      line: { width: 4, color: "red" },
    };
    let node = structure.nodes[pl_data.node];
    let pl_coords = createPointLoad(node, pl_data.x_mag, pl_data.y_mag, pl_data.z_mag);
    pl.x.push(...pl_coords.pl_x);
    pl.y.push(...pl_coords.pl_y);
    pl.z.push(...pl_coords.pl_z);
    plotly_data.push(pl);
  });

  // Distributed loads
  Object.entries(structure.distributed_loads).forEach(([dl_id, dl_data]) => {
    let dl = {
      x: [],
      y: [],
      z: [],
      type: "scatter3d",
      mode: "lines",
      hoverinfo: "none",
      line: { width: 4, color: "orange" },
    };
    let member = structure.members[dl_data.member];
    let { node_A, node_B } = member;
    node_A = structure.nodes[node_A];
    node_B = structure.nodes[node_B];
    let dl_coords = createDistributedLoad(
      node_A,
      node_B,
      dl_data.x_mag_A,
      dl_data.y_mag_A,
      dl_data.z_mag_A,
      dl_data.x_mag_B,
      dl_data.y_mag_B,
      dl_data.z_mag_B
    );
    for (let i in dl_coords.dl_x){
      dl.x.push(...dl_coords.dl_x[i]);
      dl.y.push(...dl_coords.dl_y[i]);
      dl.z.push(...dl_coords.dl_z[i]);
    }
    plotly_data.push(dl);
  });
  console.log(plotly_data);
  return plotly_data;
}

function getLayout() {
  return {
    showlegend: false,
    margin: { b: 0, l: 0, r: 0, t: 0 },
    modebar: { orientation: "v" },
    scene: {
      aspectmode: "data",
      xaxis: {
        ticks: "",
        showticklabels: false,
        zeroline: false,
        title: "",
        gridwidth: 0,
        spikesides: false,
        spikethickness: 0,
      },
      yaxis: {
        ticks: "",
        showticklabels: false,
        zeroline: false,
        title: "",
        gridwidth: 0,
        spikesides: false,
        spikethickness: 0,
      },
      zaxis: {
        ticks: "",
        showticklabels: false,
        zeroline: false,
        title: "",
        gridwidth: 0,
        spikesides: false,
        spikethickness: 0,
      },
    },
  };
}

function getConfig() {
  return {
    responsive: true,
  };
}

function createSupport(restraint_code, node) {
  let support_size = 0.6;

  let support_x = [];
  let support_y = [];
  let support_z = [];
  switch (restraint_code) {
    case "FFFFFF":
      support_x.push(node.x);
      support_y.push(node.y);
      support_z.push(node.z);

      support_x.push(node.x + support_size);
      support_y.push(node.y);
      support_z.push(node.z);

      support_x.push(node.x + support_size);
      support_y.push(node.y);
      support_z.push(node.z - support_size);

      support_x.push(node.x - support_size);
      support_y.push(node.y);
      support_z.push(node.z - support_size);

      support_x.push(node.x - support_size);
      support_y.push(node.y);
      support_z.push(node.z);

      support_x.push(node.x);
      support_y.push(node.y);
      support_z.push(node.z);

      support_x.push(node.x);
      support_y.push(node.y + support_size);
      support_z.push(node.z);

      support_x.push(node.x);
      support_y.push(node.y + support_size);
      support_z.push(node.z - support_size);

      support_x.push(node.x);
      support_y.push(node.y - support_size);
      support_z.push(node.z - support_size);

      support_x.push(node.x);
      support_y.push(node.y - support_size);
      support_z.push(node.z);

      support_x.push(node.x);
      support_y.push(node.y);
      support_z.push(node.z);
      break;
    case "FFFRRR":
      support_x.push(node.x);
      support_y.push(node.y);
      support_z.push(node.z);

      support_x.push(node.x - support_size);
      support_y.push(node.y);
      support_z.push(node.z - support_size);

      support_x.push(node.x + support_size);
      support_y.push(node.y);
      support_z.push(node.z - support_size);

      support_x.push(node.x);
      support_y.push(node.y);
      support_z.push(node.z);

      support_x.push(node.x);
      support_y.push(node.y - support_size);
      support_z.push(node.z - support_size);

      support_x.push(node.x);
      support_y.push(node.y + support_size);
      support_z.push(node.z - support_size);

      support_x.push(node.x);
      support_y.push(node.y);
      support_z.push(node.z);
      break;
    default:
      break;
  }
  return { support_x, support_y, support_z };
}

function createPointLoad(node, x_mag, y_mag, z_mag) {
  let load_size = 2;

  let xi = node.x;
  let yi = node.y;
  let zi = node.z;

  let xf = node.x - x_mag;
  let yf = node.y - y_mag;
  let zf = node.z - z_mag;

  let pl_vector = new geom_utils.Vector(xf, yf, zf, xi, yi, zi);
  let plotable_vector = geom_utils.getPlotableArrow(pl_vector, load_size);

  let pl_x = plotable_vector.x;
  let pl_y = plotable_vector.y;
  let pl_z = plotable_vector.z;

  return { pl_x, pl_y, pl_z };
}

function createDistributedLoad(node_A, node_B, x_mag_A, y_mag_A, z_mag_A, x_mag_B, y_mag_B, z_mag_B) {
  let load_size = 2;
  // Global coords for scatter
  let dl_x = [];
  let dl_y = [];
  let dl_z = [];

  // Start arrow
  let xi_start = node_A.x;
  let yi_start = node_A.y;
  let zi_start = node_A.z;

  let xf_start = node_A.x - x_mag_A;
  let yf_start = node_A.y - y_mag_A;
  let zf_start = node_A.z - z_mag_A;

  let arrow_vector_start = new geom_utils.Vector(xf_start, yf_start, zf_start, xi_start, yi_start, zi_start);
  let plotable_vector_start = geom_utils.getPlotableArrow(arrow_vector_start, load_size);

  dl_x.push(plotable_vector_start.x);
  dl_y.push(plotable_vector_start.y);
  dl_z.push(plotable_vector_start.z);

  // End arrow
  let xi_end = node_B.x;
  let yi_end = node_B.y;
  let zi_end = node_B.z;

  let xf_end = node_B.x - x_mag_B;
  let yf_end = node_B.y - y_mag_B;
  let zf_end = node_B.z - z_mag_B;

  let arrow_vector_end = new geom_utils.Vector(xf_end, yf_end, zf_end, xi_end, yi_end, zi_end);
  let plotable_vector_end = geom_utils.getPlotableArrow(arrow_vector_end, load_size);

  dl_x.push(plotable_vector_end.x);
  dl_y.push(plotable_vector_end.y);
  dl_z.push(plotable_vector_end.z);

  return { dl_x, dl_y, dl_z };
}

const renderer = { getData, getLayout, getConfig };

export default renderer;
