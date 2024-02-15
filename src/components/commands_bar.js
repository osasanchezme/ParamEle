import SearchableDropdown from "./searchable_dropdown";
import utils from "../utils";
import { addNodeToTheEditor } from "./VisualEditor";

function CommandsBar({ active, x, y, rel_orig_x, rel_orig_y, changeAppMode }) {
  const available_nodes_mapping = utils.getNodesLibrary()["mapping"];
  return (
    <SearchableDropdown
      options_map={available_nodes_mapping}
      coincidences_to_match={3}
      onChange={(node_class) => {
        addNodeToTheEditor(node_class, { x: x - rel_orig_x, y: y - rel_orig_y });
        changeAppMode("wait_action");
      }}
      className="commands-bar"
      style={{ top: y + "px", left: x + "px", display: active ? "block" : "none" }}
      placeholder={utils.getDisplayCopy("commands_bar", "placeholder")}
      is_regular_dropdown={false}
    ></SearchableDropdown>
  );
}

export default CommandsBar;
