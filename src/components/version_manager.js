import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
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
} from "@chakra-ui/react";

import { MdCancel, MdCheckCircle } from "react-icons/md";

import utils from "../utils";
import Firebase from "../js/firebase";
import { useState } from "react";

function localGetDisplayCopy(key) {
  return utils.getDisplayCopy("version_history", key);
}

function VersionManager({ isOpen, onClose, file_history, file_name, file_path }) {
  let versions_list = [];
  if (file_history) {
    versions_list = Object.entries(file_history).map(([version_key, version_data]) => (
      <VersionItem version_data={version_data} version_key={version_key} key={version_key} file_name={file_name} file_path={file_path}></VersionItem>
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

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function VersionItem({ version_key, version_data, file_name, file_path }) {
  let reportable_props = ["num_nodes", "results_available"];
  const [commitMsgActive, setCommitMsgActive] = useState(false);
  const [commitMsg, setCommitMsg] = useState(version_data.commit_msg);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  function handleClickEditCommitMessage() {
    if (commitMsgActive) {
      setIsButtonLoading(true);
      Firebase.updateCommitMsgForUser(file_path, file_name, version_key, commitMsg, (data) => {
        setIsButtonLoading(false);
        setCommitMsgActive(false);
      } )
    } else {
      setCommitMsgActive(true);
    }
  }
  function handleOnChangeTextArea(event) {
    setCommitMsg(event.target.value);
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
                <Icon as={prop_val ? MdCheckCircle : MdCancel} color="blue.600" />
              </Td>
            </Tr>
          );
          break;
        case "number":
          table_row = (
            <Tr key={prop_key}>
              <Td>{localGetDisplayCopy(prop_key)}</Td>
              <Td textAlign="center">
                <Tag paddingTop="0.5" size="sm" backgroundColor="blue.600" color="white">
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
      ></Textarea>
    </Box>
  ); 
  version_props.push(
    <Tr key={"commit_msg_row"}>
      <Td borderBottom="none">{localGetDisplayCopy(localGetDisplayCopy("commit_msg"))}:</Td>
      <Td textAlign="center" borderBottom="none">
        {commitMsgActive ? (
          <Tag
            paddingTop="0.5"
            size="sm"
            backgroundColor="blue.600"
            color="white"
            textTransform="uppercase"
            cursor="pointer"
            onClick={handleClickEditCommitMessage}
          >
            {isButtonLoading ? (<Spinner size="xs" speed="0.7s" />) : localGetDisplayCopy("save")}
          </Tag>
        ) : (
          <Tag
            paddingTop="0.5"
            size="sm"
            backgroundColor="gray.500"
            color="white"
            textTransform="uppercase"
            cursor="pointer"
            onClick={handleClickEditCommitMessage}
          >
            {localGetDisplayCopy("edit")}
          </Tag>
        )}
      </Td>
    </Tr>
  );
  return (
    <Card variant="elevated" key={version_key}>
      <CardBody>
        <Text fontWeight="bold">{utils.getFormattedDate(Number(version_key))}</Text>
        <TableContainer>
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
