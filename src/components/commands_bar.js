import SearchableDropdown from "./searchable_dropdown";
import utils from "../utils";
import { addNodeToTheEditor } from "./VisualEditor";

function CommandsBar({ active, x, y, rel_orig_x, rel_orig_y }) {
  const available_nodes_mapping = utils.getNodesLibrary()["mapping"];
  let bar_visible = active;
  let height = 50;
  let width = 300;
  if (y < 50 || y > window.innerHeight - height || x <= 0 || x > window.innerWidth - width) bar_visible = false;
  return (
    <SearchableDropdown
      active={active}
      options_map={available_nodes_mapping}
      coincidences_to_match={3}
      onChange={(node_class) => {
        addNodeToTheEditor(node_class, { x: x - rel_orig_x, y: y - rel_orig_y });
        utils.changeAppMode("wait_action");
      }}
      className="commands-bar"
      style={{ top: y + "px", left: x + "px", display: bar_visible ? "block" : "none" }}
      placeholder={utils.getDisplayCopy("commands_bar", "placeholder")}
      is_regular_dropdown={false}
    ></SearchableDropdown>
  );
}

export default CommandsBar;
