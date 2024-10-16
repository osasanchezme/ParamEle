import SearchableDropdown from "./searchable_dropdown";
import utils from "../utils";
import { addNodeToTheEditor } from "./VisualEditor";
import boxes from "../js/boxes";

function CommandsBar({ app_mode, x, y, rel_orig_x, rel_orig_y, changeAppMode }) {
  const available_nodes_mapping = utils.getNodesLibrary()["mapping"];
  let is_active = app_mode === "add_node" || app_mode === "change_node_type";
  let onChangeCallback = () => {};
  if (app_mode === "add_node") {
    onChangeCallback = (node_class) => {
      addNodeToTheEditor(node_class, { x: x - rel_orig_x, y: y - rel_orig_y });
      changeAppMode("wait_action");
    };
  } else if (app_mode === "change_node_type") {
    onChangeCallback = (node_class) => {
      boxes.changeNodesType(node_class);
      changeAppMode("wait_action");
    };
  }
  return (
    <SearchableDropdown
      options_map={available_nodes_mapping}
      coincidences_to_match={3}
      onChange={onChangeCallback}
      className="commands-bar"
      style={{ top: y + "px", left: x + "px", display: is_active ? "block" : "none" }}
      placeholder={utils.getDisplayCopy("commands_bar", "placeholder")}
      is_regular_dropdown={false}
    ></SearchableDropdown>
  );
}

export default CommandsBar;
