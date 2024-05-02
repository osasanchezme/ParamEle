import React, { useEffect } from "react";
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
  Skeleton,
  Flex,
  Avatar,
  Box,
  FormLabel,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Icon,
  MenuDivider,
  Spinner,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import utils from "../utils";
import { FormComponent, getDefaultState, validateInputData } from "./form";
import { useState } from "react";
import Firebase from "../js/firebase";
import { notify } from "./notification";
import { MdArrowDropDown, MdCheck, MdOutlinePersonAddAlt } from "react-icons/md";
import { getPublicRolesKeys } from "../js/userRoles";
import { cloneDeep } from "lodash";
function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("share_manager", copy_key);
}
/**
 *
 * @param {object} param0
 * @param {boolean} param0.is_sharing_manager_open
 * @param {function()} param0.closeSharingManager
 * @param {import("../js/types").ParamEleFileData} param0.file_data
 * @param {import("../js/types").ParamEleSetFileDataCallback} param0.setFileData
 * @returns
 */
function SharingManager({ is_sharing_manager_open, closeSharingManager, getContactInformation, file_data, setFileData }) {
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
    user_role: {
      default: "editor",
      type: "dropdown",
      data: getPublicRolesKeys(),
      validation: [{ type: "no", criteria: "", msg: "cannot_be_empty" }],
    },
  };
  let [shareFileFormState, setShareFileFormState] = useState(getDefaultState(share_file_form_fields));
  let [shareButtonLoading, setShareButtonLoading] = useState(false);
  let { file_name, file_shared_data } = file_data;
  const shareFileWithUser = () => {
    setShareButtonLoading(true);
    let { valid_data, new_state } = validateInputData(shareFileFormState, share_file_form_fields);
    setShareFileFormState(new_state);
    if (valid_data) {
      Firebase.shareFileWithUser(new_state, file_data, (process_response) => {
        setShareButtonLoading(false);
        if (process_response.success) {
          setFileData({ file_shared_data: { ...file_data.file_shared_data, ...process_response.data } });
          notify("success", "successfully_shared", undefined, true);
        } else {
          shareFileFormState.user_email.error_msg = process_response.msg;
          shareFileFormState.user_email.valid = false;
          setShareFileFormState(shareFileFormState);
        }
      });
    } else {
      setShareButtonLoading(false);
    }
  };
  return (
    <Modal isOpen={is_sharing_manager_open} onClose={closeSharingManager} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormLabel>{localGetDisplayCopy("file_name")}</FormLabel>
          <Input mb={3} variant="filled" value={file_name} readOnly />
          <FormComponent
            fields={share_file_form_fields}
            formState={shareFileFormState}
            setFormState={setShareFileFormState}
            copies_key="share_manager"
          ></FormComponent>
          <Flex pt={2}>
            <Spacer />
            <Button colorScheme="blue" onClick={shareFileWithUser} isLoading={shareButtonLoading}>
              {localGetDisplayCopy("title")}
            </Button>
          </Flex>
          <Divider mt={6} mb={3} />
          <FormLabel>{localGetDisplayCopy("shared_with")}</FormLabel>
          {file_shared_data && Object.keys(file_shared_data).length > 0 ? (
            Object.keys(file_shared_data).map((shared_user_id) => (
              <PersonItem
                key={shared_user_id}
                file_shared_data={file_shared_data}
                shared_user_id={shared_user_id}
                getContactInformation={getContactInformation}
                file_data={file_data}
                setFileData={setFileData}
              />
            ))
          ) : (
            <Card align="center" variant="filled">
              <CardBody>
                <Flex>
                  <Icon as={MdOutlinePersonAddAlt} boxSize="50px" color="gray.500" />
                  <Text ml={3}>{localGetDisplayCopy("file_not_shared")}</Text>
                </Flex>
              </CardBody>
            </Card>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={closeSharingManager}>
            {localGetDisplayCopy("close")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/**
 *
 * @param {object} param0
 * @param {import("../js/types").ParamEleFileSharedData} param0.file_shared_data
 * @param {string} param0.shared_user_id
 * @param {import("../js/state_types").ParamEleStateGetContactInformation} param0.getContactInformation
 * @param {import("../js/types").ParamEleFileData} param0.file_data
 * @param {import("../js/types").ParamEleSetFileDataCallback} param0.setFileData
 */
function PersonItem({ file_shared_data, shared_user_id, getContactInformation, file_data, setFileData }) {
  /** @type {[import("../js/types").ParamEleContact]} */
  let [contactData, setContactData] = useState(null);
  let [accessMenuLoading, setAccessMenuLoading] = useState(false);
  useEffect(() => {
    getContactInformation(shared_user_id, "uid", setContactData);
  }, []);
  /**
   * Handles the access updates in the database
   * @param {{action: "remove"|"change_role", value: string}|undefined} update_object
   */
  const handleSharingUpdate = (update_object) => {
    setAccessMenuLoading(true);
    let new_file_shared_data = cloneDeep(file_shared_data[shared_user_id]);
    let is_remove = false;
    switch (update_object.action) {
      case "change_role":
        new_file_shared_data.role = update_object.value;
        break;
      case "remove":
        is_remove = true;
        break;
    }
    Firebase.updateSharedFileData(shared_user_id, new_file_shared_data, is_remove, file_data, (process_response) => {
      if (process_response.success) {
        if (!is_remove) {
          setFileData({ file_shared_data: { ...file_data.file_shared_data, [shared_user_id]: new_file_shared_data } });
        } else {
          delete file_data.file_shared_data[shared_user_id];
          setFileData({ file_shared_data: { ...file_data.file_shared_data } });
        }
        notify("success", "successfully_updated", undefined, true);
        setAccessMenuLoading(false);
      } else {
        setAccessMenuLoading(false);
        notify("warning", "generic_unhandled_issue_try_again", undefined, true);
      }
    });
  };
  return (
    <Card mb={3} colorScheme="blue" variant="outline">
      <CardBody p={2}>
        {contactData ? (
          <Flex>
            <Avatar size="sm" name={contactData.username} />
            <Box ml="3">
              <Text fontSize="small" fontWeight="bold">
                {contactData.username}
              </Text>
              <Text fontSize="smaller" marginTop={"-1.5"}>
                {contactData.email}
              </Text>
            </Box>
            <Spacer />
            <Box ml="3">
              <Menu>
                <MenuButton as={Button} rightIcon={<MdArrowDropDown />}>
                  {accessMenuLoading ? <Spinner mt={2} /> : localGetDisplayCopy(file_shared_data[shared_user_id].role)}
                </MenuButton>
                <MenuList>
                  {getPublicRolesKeys().map((role_key) => (
                    <MenuItem
                      key={role_key}
                      onClick={() => {
                        handleSharingUpdate({ action: "change_role", value: role_key });
                      }}
                    >
                      <Icon mr={4} as={MdCheck} visibility={role_key == file_shared_data[shared_user_id].role ? "visible" : "hidden"} />
                      {localGetDisplayCopy(role_key)}
                    </MenuItem>
                  ))}
                  <MenuDivider />
                  <MenuItem
                    onClick={() => {
                      handleSharingUpdate({ action: "remove" });
                    }}
                  >
                    <Icon mr={4} as={MdCheck} visibility={"hidden"} />
                    {localGetDisplayCopy("remove_access")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
        ) : (
          <Flex>
            <Avatar size="sm" />
            <Box ml="3">
              <Skeleton height="10px" width="30px" marginTop="5px" />
              <Skeleton height="8px" width="60px" marginTop="6px" />
            </Box>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
}

export default SharingManager;
