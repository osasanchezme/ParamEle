import { createStandaloneToast } from "@chakra-ui/toast";
import utils from "../utils";

const { toast } = createStandaloneToast();

/**
 * Generic notification for the user
 * @param {"success"|"error"|"warning"|"info"} status
 * @param {string} title - Direct title of the notification or the key in the copies
 * @param {string} description
 * @param {boolean=} get_from_copy
 * @param {number=} duration
 */
function notify(status, title, description, get_from_copy = false, duration = 4000) {
  let final_description = description;
  if (get_from_copy) {
    final_description = utils.getDisplayCopy("notifications", `${title}_desc`);
    if (title == "generic_unhandled_issue" && description) {
      final_description += ` ${description}`;
      duration = 10000;
    }
    title = utils.getDisplayCopy("notifications", `${title}_title`);
  }
  toast({
    title,
    description: final_description,
    status,
    duration,
    isClosable: true,
  });
}

function closeAllNotifications() {
  toast.closeAll();
}

const notification = { notify, closeAllNotifications };
export default notification;
export { notify, closeAllNotifications };
