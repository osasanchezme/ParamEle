import getState from "../getState";
function getData() {
  let structure = getState("structure");
  let units = getState("model")["units"];
  let plotly_data = [];

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

    let member_length = Math.sqrt((node_A.x - node_B.x)**2 + (node_A.y - node_B.y)**2 + (node_A.z - node_B.z)**2);
    let member_label = `Elemento  ${member_id} (${member_length} ${units.length})`;

    // Selection nodes along the member
    let node_middle = { x: (node_A.x + node_B.x) / 2, y: (node_A.y + node_B.y) / 2, z: (node_A.z + node_B.z) / 2 };
    selection_nodes.x.push(node_middle.x);
    selection_nodes.y.push(node_middle.y);
    selection_nodes.z.push(node_middle.z);
    selection_nodes.text.push(member_label);
  });
  plotly_data.push(selection_nodes);
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

function getConfig(){
  return {
    responsive: true
  };
}

const renderer = { getData, getLayout, getConfig };

export default renderer;
