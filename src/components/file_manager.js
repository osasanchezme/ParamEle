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
  Box,
  Image,
  Badge,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import utils from "../utils";
import { useState } from "react";
import { MdFolder } from "react-icons/md";

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("file_manager", copy_key);
}

function FileManager({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [fileManagerMode, setFileManagerMode] = useState("open");
  /**
   * Opens the file manager in a certain mode
   * @param {"save"|open""} mode
   */
  window.ParamEle.openFileManager = (mode) => {
    onOpen();
    setFileManagerMode(mode);
  };
  if (user == null) {
    // utils.openAuthentication();
  } else {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={4} spacing={5}>
              <Folder files={3} folders={2} lastModified={1687447278965} name={"Samples"}></Folder>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {utils.getDisplayCopy("auth", "close_modal")}
            </Button>
            {fileManagerMode === "save" ? (
              <Button colorScheme="blue">{localGetDisplayCopy("save")}</Button>
            ) : fileManagerMode === "open" ? (
              <Button colorScheme="blue">{localGetDisplayCopy("open")}</Button>
            ) : (
              ""
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}

function Folder({ folders, files, name, lastModified }) {
  let [selectedFolder, setSelectedFolder] = useState(false);
  let formatted_date = new Date(lastModified);
  formatted_date = `${formatted_date.toDateString()}, ${formatted_date.toLocaleTimeString()}`;
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      bg={selectedFolder ? "gray.100" : "white"}
      cursor={"pointer"}
      overflow="hidden"
      onMouseOver={() => setSelectedFolder(true)}
      onMouseLeave={() => setSelectedFolder(false)}
    >
      <Icon as={MdFolder} boxSize={"100px"} color="gray.500" width="100%" />
      <Box p="2">
        <Box color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase">
          {folders} {localGetDisplayCopy("folders")} &bull; {files} {localGetDisplayCopy("files")}
        </Box>

        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1}>
          {name}
        </Box>

        <Box as="span" color="gray.600" fontSize="sm">
          {formatted_date}
        </Box>
      </Box>
    </Box>
  );
}

export default FileManager;
