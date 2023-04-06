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
  if (get_from_copy){
    description = utils.getDisplayCopy("notifications", `${title}_desc`);
    title = utils.getDisplayCopy("notifications", `${title}_title`);
  }
  toast({
    title,
    description,
    status,
    duration,
    isClosable: true,
  });
}

export default notify;
