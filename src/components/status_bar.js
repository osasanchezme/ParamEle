import utils from "../utils";

const localGetCopy = (copy_key) => utils.getDisplayCopy("status_bar", copy_key);

function StatusBar({ app_mode, changeAppMode }) {
  return <div className="status-bar">
    {localGetCopy(app_mode)}
  </div>;
}

export default StatusBar;
