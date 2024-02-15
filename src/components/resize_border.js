import utils from "../utils";
import state from "../state";

function ResizeBorder({ id, visible, position, changeAppMode }) {
  function handleMouseDown(e) {
    changeAppMode("resizing_modules");
    state.setGlobalVariable("current_resizer", id);
  }
  function handleMouseUp(e) {
    changeAppMode("wait_action");
  }

  return (
    <div
      className="border-resizer"
      style={{ display: visible ? "block" : "none", left: String(position) + "%" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="small-circle up"></div>
      <div className="small-circle middle"></div>
      <div className="small-circle down"></div>
    </div>
  );
}

export default ResizeBorder;
