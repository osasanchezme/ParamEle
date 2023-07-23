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
  Flex,
  Spacer,
  ButtonGroup,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import utils from "../utils";
import { useState } from "react";
import { MdFolder, MdInsertDriveFile, MdHomeFilled, MdOutlineInsertDriveFile, MdCreateNewFolder, MdCheck, MdRefresh } from "react-icons/md";
import Firebase from "../js/firebase";
import PopoverForm from "./popover_form";
const { isIdFromFolder } = utils;

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("file_manager", copy_key);
}

function FileManager({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [fileManagerMode, setFileManagerMode] = useState("open");
  let [fileManagerPath, setFileManagerPath] = useState(["home"]);
  let [fileManagerContent, setFileManagerContent] = useState(null);
  let [fileManagerWaiting, setFileManagerWaiting] = useState(true);
  /**
   * Opens the file manager in a certain mode
   * @param {"save"|open""} mode
   */
  window.ParamEle.openFileManager = (mode) => {
    onOpen();
    setFileManagerMode(mode);
    getFilesDataFromDatabase();
  };
  /**
   *
   * @param {object} data
   * @param {boolean} add_to_current_folder Add the data to the current folder, if false or undefined, replaces the whole data
   */
  function updateFileManagerData(data, add_to_current_folder) {
    if (add_to_current_folder) {
      let current_content = JSON.parse(JSON.stringify(fileManagerContent));
      let current_location = current_content;
      for (let i = 1; i < fileManagerPath.length; i++) {
        current_location = current_location[fileManagerPath[i]];
        if (!current_location.hasOwnProperty("content")) current_location.content = {};
        current_location = current_location.content;
      }
      Object.entries(data).forEach(([folder_name, folder_content]) => {
        current_location[folder_name] = folder_content;
      });
      data = current_content;
    }
    setFileManagerWaiting(false);
    if (JSON.stringify(data) !== JSON.stringify(fileManagerContent)) setFileManagerContent(data);
  }
  function getFilesDataFromDatabase() {
    // Display the loading spinner while data comes back
    setFileManagerWaiting(true);
    console.log("Getting data from Firebase...");
    Firebase.getUserProjects(updateFileManagerData);
  }
  function validateFolderName(folder_name) {
    let files_to_display = getFilesAndFoldersToDisplay();
    if (files_to_display.hasOwnProperty(folder_name)) {
      return {
        valid: false,
        error_msg: localGetDisplayCopy("existing_folder"),
      };
    } else {
      return {
        valid: true,
      };
    }
  }
  function createNewFolder(formState) {
    let folder_name = formState.folder_name.value;
    // Check if the parent folder has children
    let files_to_display = getFilesAndFoldersToDisplay();
    let is_first_child = Object.keys(files_to_display).length === 0;
    Firebase.createNewFolderForUser(folder_name, JSON.parse(JSON.stringify(fileManagerPath)), is_first_child, updateFileManagerData);
  }
  function getFilesAndFoldersToDisplay() {
    let files_to_display = JSON.parse(JSON.stringify(fileManagerContent));
    fileManagerPath.forEach((folder_name, i) => {
      if (i > 0) {
        files_to_display = files_to_display[folder_name].content || {};
      }
    });
    return files_to_display;
  }
  if (user == null) {
    // utils.openAuthentication();
  } else {
    let files_to_display = getFilesAndFoldersToDisplay();
    let fileman_body = "";
    if (!fileManagerWaiting) {
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
            <Flex minWidth="max-content" alignItems="center" gap="2">
              <Box p="2">
                <PathNavigator setFileManagerPath={setFileManagerPath} fileManagerPath={fileManagerPath} />
              </Box>
              <Spacer />
              <ButtonGroup gap="2">
                <PopoverForm
                  fields={{
                    folder_name: {
                      default: "",
                      type: "text",
                      validation: [
                        { type: "no", criteria: "", msg: "cannot_be_empty" },
                        { type: "custom_function", criteria: validateFolderName, msg: "custom" },
                      ],
                      is_first_field: true,
                    },
                  }}
                  copies_key="file_manager"
                  action_button_icon={MdCheck}
                  action_function={createNewFolder}
                >
                  <IconButton variant="ghost" icon={<Icon as={MdCreateNewFolder} boxSize={6} />} />
                </PopoverForm>
                <IconButton variant="ghost" icon={<Icon as={MdRefresh} boxSize={6} onClick={getFilesDataFromDatabase} />} />
              </ButtonGroup>
            </Flex>

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
