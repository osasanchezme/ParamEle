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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import utils from "../utils";
import { useState } from "react";
import { MdFolder, MdInsertDriveFile, MdHomeFilled, MdOutlineInsertDriveFile } from "react-icons/md";
import Firebase from "../js/firebase";
const { isIdFromFolder } = utils;

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("file_manager", copy_key);
}

function FileManager({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [fileManagerMode, setFileManagerMode] = useState("open");
  let [fileManagerPath, setFileManagerPath] = useState(["home"]);
  let [fileManagerContent, setFileManagerContent] = useState(null);
  /**
   * Opens the file manager in a certain mode
   * @param {"save"|open""} mode
   */
  window.ParamEle.openFileManager = (mode) => {
    onOpen();
    setFileManagerMode(mode);
    getFilesDataFromDatabase();
  };
  function getFilesDataFromDatabase() {
    console.log("Getting data from Firebase...");
    Firebase.getUserProjects((data) => {
      if (JSON.stringify(data) !== JSON.stringify(fileManagerContent)) setFileManagerContent(data);
    });
  }
  if (user == null) {
    // utils.openAuthentication();
  } else {
    let files_to_display = JSON.parse(JSON.stringify(fileManagerContent));
    fileManagerPath.forEach((folder_name, i) => {
      if (i > 0) {
        files_to_display = files_to_display[folder_name].content || {};
      }
    });
    let fileman_body = "";
    if (files_to_display) {
      if (Object.keys(files_to_display).length > 0) {
        fileman_body = (
          <SimpleGrid columns={4} spacing={5}>
            <FileManagerView data={files_to_display} setFileManagerPath={setFileManagerPath} fileManagerPath={fileManagerPath}></FileManagerView>
          </SimpleGrid>
        );
      } else {
        fileman_body = (
          <Center h="200px">
            <VStack>
              <Icon as={MdOutlineInsertDriveFile} boxSize={"100px"} color="gray.500" width="100%" />
              <Box>{localGetDisplayCopy("no_content")}</Box>
            </VStack>
          </Center>
        );
      }
    } else {
      fileman_body = (
        <Center h="200px">
          <VStack>
            <Box maxW="sm">
              <Spinner size="xl" speed="0.8s" />
            </Box>
            <Box>{localGetDisplayCopy("loading")}...</Box>
          </VStack>
        </Center>
      );
    }
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PathNavigator setFileManagerPath={setFileManagerPath} fileManagerPath={fileManagerPath}></PathNavigator>
            {fileman_body}
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

function PathNavigator({ fileManagerPath, setFileManagerPath }) {
  function handleClick(event, index) {
    let new_path = [];
    for (let i = 0; i <= index; i++) {
      new_path.push(fileManagerPath[i]);
    }
    setFileManagerPath(new_path);
  }
  return (
    <Breadcrumb>
      {fileManagerPath.map((path, index) => {
        let path_object = "";
        if (index === 0) {
          path_object = (
            <BreadcrumbLink onClick={(event) => handleClick(event, index)}>
              <Icon as={MdHomeFilled} />
            </BreadcrumbLink>
          );
        } else {
          path_object = <BreadcrumbLink onClick={(event) => handleClick(event, index)}>{path}</BreadcrumbLink>;
        }
        return <BreadcrumbItem key={index}>{path_object}</BreadcrumbItem>;
      })}
    </Breadcrumb>
  );
}

function Folder({ folders, files, name, lastModified, onClick }) {
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
      onClick={onClick}
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

function File({ nodes, name, lastModified, onClick }) {
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
      onClick={onClick}
    >
      <Icon as={MdInsertDriveFile} boxSize={"100px"} color="gray.500" width="100%" />
      <Box p="2">
        <Box color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase">
          {nodes} {localGetDisplayCopy("nodes")}
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

function FileManagerView({ data, setFileManagerPath, fileManagerPath }) {
  function handleClick(event, folder_name) {
    let new_path = JSON.parse(JSON.stringify(fileManagerPath));
    new_path.push(folder_name);
    setFileManagerPath(new_path);
  }
  let fileman_view = Object.entries(data).map(([name, content]) => {
    if (isIdFromFolder(content.id)) {
      let num_files = 0;
      let num_folders = 0;
      if (content.content) {
        Object.values(content.content).forEach((item) => {
          if (isIdFromFolder(item.id)) {
            num_folders++;
          } else {
            num_files++;
          }
        });
      }
      return (
        <Folder
          files={num_files}
          folders={num_folders}
          lastModified={content.last_modified}
          name={name}
          key={name}
          onClick={(evt) => {
            handleClick(evt, name);
          }}
        ></Folder>
      );
    } else {
      return <File nodes={content.stats.num_nodes} lastModified={content.last_modified} name={name} key={name}></File>;
    }
  });
  return fileman_view;
}

export default FileManager;
