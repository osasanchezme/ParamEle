import getState from "../getState";
function getData() {
  let structure = getState("structure");
  let plotly_data = [];

  // Add nodes
  let nodes = {
    x: [],
    y: [],
    z: [],
    type: "scatter3d",
    mode: "markers",
    marker: { color: "red" },
  };
  Object.entries(structure.nodes).forEach(([node_id, node_data]) => {
    nodes.x.push(node_data.x);
    nodes.y.push(node_data.y);
    nodes.z.push(node_data.z);
  });
  plotly_data.push(nodes);

  // Members
  Object.entries(structure.members).forEach(([member_id, member_data]) => {
    let member = { x: [], y: [], z: [], type: "scatter3d", mode: "lines", marker: { color: "blue" } };
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
  });
  return plotly_data;
}

function getLayout() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
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
      },
      yaxis: {
        ticks: "",
        showticklabels: false,
        zeroline: false,
        title: "",
        gridwidth: 0,
      },
      zaxis: {
        ticks: "",
        showticklabels: false,
        zeroline: false,
        title: "",
        gridwidth: 0,
      },
    },
  };
}

const renderer = { getData, getLayout };

export default renderer;
