import GenericInOutNode from "./generics/genericInOut";
import utils from "../utils";

function localGetCopy(node_name) {
  return utils.getDisplayCopy("nodes", node_name);
}


// 2D plot
const plot_2d_target_ids = ["plotable-plotly_data"];
function Display2DPlot({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("dataDisplay2DPlot")}
      data={data}
      id={id}
      target_ids={plot_2d_target_ids}
      editable_ids={[]}
      source_ids={[]}
      plot_settings={{type: "2d", width: 500, height: 500}}
    ></GenericInOutNode>
  );
}

function Display2DPlotExec(args) {
  let full_args = plot_2d_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "input": {
      ...structural_args,
    }
  };
}

// Table
const table_target_ids = ["plotable-plotly_data"];
function DisplayTable({ data, id }) {
  return (
    <GenericInOutNode
      node_label={localGetCopy("dataDisplayTable")}
      data={data}
      id={id}
      target_ids={table_target_ids}
      editable_ids={[]}
      source_ids={[]}
      include_table={true}
    ></GenericInOutNode>
  );
}

function DisplayTableExec(args) {
  let full_args = table_target_ids;
  let structural_args = utils.convertNodeToStructuralArgs(args, full_args);
  return {
    "input": {
      ...structural_args,
    }
  };
}

const DataDisplayNodes = {
    Display2DPlotNode: { Node: Display2DPlot, Exec: Display2DPlotExec },
    DisplayTableNode: { Node: DisplayTable, Exec: DisplayTableExec },
};

export default DataDisplayNodes;
