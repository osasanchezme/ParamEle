import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Stack,
  Card,
  CardBody,
  Text,
  Tag,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Icon,
  Textarea,
  Box,
  Spinner,
  Flex,
  Spacer,
  Center,
  Tooltip,
  ButtonGroup,
  Avatar,
  Skeleton,
} from "@chakra-ui/react";

import { MdCancel, MdCheckCircle, MdDelete, MdEdit, MdSave } from "react-icons/md";

import utils from "../utils";
import Firebase from "../js/firebase";
import file from "../js/file";
import { useState, useRef, useEffect } from "react";

function localGetDisplayCopy(key) {
  return utils.getDisplayCopy("version_history", key);
}

function VersionManager({ isOpen, onClose, file_history, setFileData, getFileData, setModelLock, openConfirmationDialog, getContactInformation, user }) {
  let versions_list = [];
  if (file_history) {
    versions_list = Object.entries(file_history).map(([version_key, version_data]) => (
      <VersionItem
        version_data={version_data}
        version_key={version_key}
        key={version_key}
        setFileData={setFileData}
        getFileData={getFileData}
        setModelLock={setModelLock}
        closeVersionManager={onClose}
        openConfirmationDialog={openConfirmationDialog}
        getContactInformation={getContactInformation}
        user={user}
      ></VersionItem>
    ));
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="4">{versions_list}</Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
/**
 *
 * @param {Object} param0
 * @param {import("../js/types").ParamEleFileVersionItem} param0.version_data
 * @param {import("../js/types").ParamEleSetFileDataCallback} param0.setFileData
 * @param {import("../js/types").ParamEleGetFileDataCallback} param0.getFileData
 * @param {import("../js/state_types").ParamEleStateGetContactInformation} param0.getContactInformation
 * @returns
 */
function VersionItem({
  version_key,
  version_data,
  setFileData,
  getFileData,
  setModelLock,
  closeVersionManager,
  openConfirmationDialog,
  getContactInformation,
  user
}) {
  let reportable_props = ["num_nodes", "results_available"];
  const [commitMsgActive, setCommitMsgActive] = useState(false);
  const [commitMsg, setCommitMsg] = useState(version_data.commit_msg);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  /** @type {[import("../js/types").ParamEleContact, any]} */
  const [authorData, setAuthorData] = useState(null);
  const text_area_ref = useRef(null);
  function handleClickEditCommitMessage() {
    if (commitMsgActive) {
      setIsButtonLoading(true);
      let local_file_data = getFileData();
      Firebase.updateCommitMsgForUser(local_file_data, version_key, commitMsg, (data) => {
        setIsButtonLoading(false);
        setCommitMsgActive(false);
      });
    } else {
      setCommitMsgActive(true);
    }
  }
  useEffect(() => {
    if (commitMsgActive) text_area_ref.current.focus();
  }, [commitMsgActive]);
  useEffect(() => {
    if (version_data.author) {
      getContactInformation(version_data.author, "uid", (contact_data) => {
        setAuthorData(contact_data);
      });
    }
  }, []);
  function handleOnChangeTextArea(event) {
    setCommitMsg(event.target.value);
  }
  function handleClickOnLoadButton() {
    let local_file_data = { ...getFileData(), current_version: version_key };
    file.downloadAndOpenModel(local_file_data, setFileData, setModelLock);
    closeVersionManager();
  }
  function handleClickOnDeleteButton() {
    let dialog_callbacks = [
      {
        run: (close_dialog_callback) => {
          Firebase.deleteFileVersionFromCloud(getFileData(), version_data.results_available, version_key, () => {
            close_dialog_callback();
            closeVersionManager();
          });
        },
        copy: "ok",
        color: "red",
      },
    ];
    openConfirmationDialog("delete_version", dialog_callbacks, true);
  }
  let version_props = Object.entries(version_data).map(([prop_key, prop_val]) => {
    let table_row = "";
    if (reportable_props.includes(prop_key)) {
      switch (typeof prop_val) {
        case "boolean":
          table_row = (
            <Tr key={prop_key}>
              <Td>{localGetDisplayCopy(prop_key)}</Td>
              <Td textAlign="center">
                <Icon as={prop_val ? MdCheckCircle : MdCancel} color="gray.500" />
              </Td>
            </Tr>
          );
          break;
        case "number":
          table_row = (
            <Tr key={prop_key}>
              <Td>{localGetDisplayCopy(prop_key)}</Td>
              <Td textAlign="center">
                <Tag paddingTop="0.5" size="sm" backgroundColor="gray.500" color="white">
                  {prop_val}
                </Tag>
              </Td>
            </Tr>
          );
          break;
        default:
          return "";
          break;
      }
    }
    return table_row;
  });
  // Add the commit message
  let commit_message_editor = (
    <Box paddingRight="4" paddingLeft="4">
      <Textarea
        defaultValue={commitMsg}
        onChange={handleOnChangeTextArea}
        resize="none"
        isDisabled={!commitMsgActive}
        size="sm"
        marginRight="10"
        ref={text_area_ref}
      ></Textarea>
    </Box>
  );
  version_props.push(
    <Tr key={"commit_msg_row"}>
      <Td borderBottom="none">{localGetDisplayCopy(localGetDisplayCopy("commit_msg"))}:</Td>
      <Td textAlign="center" borderBottom="none">
        {commitMsgActive ? (
          <Tooltip label={localGetDisplayCopy("save")}>
            <Tag size="sm" backgroundColor="blue.600" color="white" textTransform="uppercase" cursor="pointer" onClick={handleClickEditCommitMessage}>
              {isButtonLoading ? <Spinner size="xs" speed="0.7s" /> : <Icon as={MdSave} />}
            </Tag>
          </Tooltip>
        ) : (
          <Tooltip label={localGetDisplayCopy("edit")}>
            <Tag size="sm" backgroundColor="gray.500" color="white" textTransform="uppercase" cursor="pointer" onClick={handleClickEditCommitMessage}>
              <Icon as={MdEdit} />
            </Tag>
          </Tooltip>
        )}
      </Td>
    </Tr>
  );
  function getAuthorTag() {
    if (!authorData) {
      return (
        <Flex paddingTop={3}>
          <Avatar size="sm" />
          <Box ml="3">
            <Skeleton height="10px" width="30px" marginTop="5px" />
            <Skeleton height="8px" width="60px" marginTop="6px" />
          </Box>
        </Flex>
      );
    } else {
      return (
        <Flex paddingTop={3}>
          <Avatar size="sm" name={version_data.author == user.uid ? null : authorData.username} />
          <Box ml="3">
            <Text fontSize="small" fontWeight="bold">
              {version_data.author == user.uid ? localGetDisplayCopy("you") : authorData.username}
            </Text>
            <Text fontSize="smaller" marginTop={"-1.5"}>{authorData.email}</Text>
          </Box>
        </Flex>
      );
    }
  }
  return (
    <Card variant="elevated" key={version_key}>
      <CardBody>
        <Flex>
          <Center>
            <Text fontWeight="bold">{utils.getFormattedDate(Number(version_key))}</Text>
          </Center>
          <Spacer />
          <ButtonGroup size="sm">
            <Tooltip label={localGetDisplayCopy("delete")}>
              <Button colorScheme="red" onClick={handleClickOnDeleteButton} padding={0.5}>
                <Icon as={MdDelete} />
              </Button>
            </Tooltip>
            <Button colorScheme="blue" onClick={handleClickOnLoadButton}>
              {localGetDisplayCopy("load")}
            </Button>
          </ButtonGroup>
        </Flex>
        {getAuthorTag()}
        <TableContainer marginTop="3">
          <Table size="sm">
            <Tbody>{version_props}</Tbody>
          </Table>
        </TableContainer>
        {/* Add a label to label the textarea */}
        {commit_message_editor}
      </CardBody>
    </Card>
  );
}

export default VersionManager;
