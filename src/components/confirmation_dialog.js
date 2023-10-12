import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import utils from "../utils";

function localGetDisplayCopy(key) {
  return utils.getDisplayCopy("confirmation_dialog", key);
}

/**
 *
 * @param {{callbacks: Array<{run: CallableFunction, copy: string, color: string, action:"close"|undefined}>}} param0
 * @returns
 */
function ConfirmationDialog({ isDialogOpen, closeDialog, callbacks, message_copy }) {
  let callback_buttons = "";
  if (callbacks) {
    callback_buttons = callbacks.map((callback) => {
      let callback_function = () => {
        callback.run();
      };
      if (callback.action) {
        if (callback.action === "close") {
          callback_function = () => {
            callback.run();
            closeDialog();
          };
        }
      }
      return (
        <Button mr={3} key={callback.copy} colorScheme={callback.color} onClick={callback_function}>
          {localGetDisplayCopy(callback.copy)}
        </Button>
      );
    });
  }
  return (
    <Modal isOpen={isDialogOpen} onClose={closeDialog}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px) hue-rotate(0deg)" />
      <ModalContent>
        <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{localGetDisplayCopy(message_copy)}</ModalBody>
        <ModalFooter>{callback_buttons}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export { ConfirmationDialog };
