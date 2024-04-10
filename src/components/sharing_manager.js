import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Card,
  CardBody,
  Divider,
} from "@chakra-ui/react";
import utils from "../utils";
import { FormComponent, getDefaultState, validateInputData } from "./form";
import { useState } from "react";
import Firebase from "../js/firebase";
import { notify } from "./notification";
function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("share_manager", copy_key);
}

function SharingManager({ is_sharing_manager_open, closeSharingManager, file_data }) {
  /**
   * @type {import("../js/types").ParamEleFormDefaultStateObject}
   */
  const share_file_form_fields = {
    user_email: {
      default: "",
      type: "email",
      validation: [
        { type: "no", criteria: "", msg: "cannot_be_empty" },
        { type: "contains", criteria: "@", msg: "no_valid_email" },
        { type: "contains", criteria: ".", msg: "no_valid_email" },
      ],
      is_first_field: true,
    },
  };
  let [shareFileFormState, setShareFileFormState] = useState(getDefaultState(share_file_form_fields));
  let [shareButtonLoading, setShareButtonLoading] = useState(false);
  let { file_name } = file_data;
  const shareFileWithUser = () => {
    setShareButtonLoading(true);
    let { valid_data, new_state } = validateInputData(shareFileFormState, share_file_form_fields);
    setShareFileFormState(new_state);
    if (valid_data) {
      Firebase.shareFileWithUser(new_state, file_data, (process_response) => {
        setShareFileFormState(false);
        if (process_response.success) {
          closeSharingManager();
          notify("success", "successfully_shared", undefined, true);
        } else {
          shareFileFormState.user_email.error_msg = process_response.msg;
          shareFileFormState.user_email.valid = false;
          setShareFileFormState(shareFileFormState);
        }
      });
    }
  };
  return (
    <Modal isOpen={is_sharing_manager_open} onClose={closeSharingManager} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card mb={3} colorScheme="blue" variant="outline">
            <CardBody>
              <Text>
                <span style={{ fontWeight: "bold" }}>{localGetDisplayCopy("file_name")}:</span> {file_name}
              </Text>
            </CardBody>
          </Card>
          <FormComponent
            fields={share_file_form_fields}
            formState={shareFileFormState}
            setFormState={setShareFileFormState}
            copies_key="share_manager"
          ></FormComponent>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={shareFileWithUser} isLoading={shareButtonLoading}>
            {localGetDisplayCopy("update")}
          </Button>
          <Button variant="ghost" onClick={closeSharingManager}>
            {localGetDisplayCopy("close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SharingManager;
