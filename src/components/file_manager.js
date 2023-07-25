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
import { useState, useRef, useEffect } from "react";
import { MdFolder, MdInsertDriveFile, MdHomeFilled, MdOutlineInsertDriveFile, MdCreateNewFolder, MdCheck, MdRefresh } from "react-icons/md";
import Firebase from "../js/firebase";
import PopoverForm from "./popover_form";
import file from "../js/file";
import ParamEleForm from "./form";
const { isIdFromFolder } = utils;
const { FormComponent, getDefaultState, validateInputData } = ParamEleForm;

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("file_manager", copy_key);
}

function FileManager({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [fileManagerMode, setFileManagerMode] = useState("open");
  let [fileManagerPath, setFileManagerPath] = useState(["home"]);
  let [fileManagerContent, setFileManagerContent] = useState(null);
  let [fileManagerWaiting, setFileManagerWaiting] = useState(true);
  const fileNameFormFields = {
    file_name: {
      default: "",
      type: "text",
      validation: [
        { type: "no", criteria: "", msg: "cannot_be_empty" },
        {
          type: "custom_function",
          criteria: (file_name) => {
            return validateFolderName(file_name, true);
          },
          msg: "custom",
        },
      ],
      is_first_field: true,
    },
  };
  let [fileNameForm, setFileNameForm] = useState(getDefaultState(fileNameFormFields));
  let file_name_ref = useRef(null);
  /**
   * Run every time the component renders to keep the focus on the file name field
   */
  useEffect(() => {
    if (fileManagerMode === "save" && file_name_ref && file_name_ref.current) file_name_ref.current.focus();
  });
  /**
   * Opens the file manager in a certain mode
   * @param {"save"|open""} mode
   */
  window.ParamEle.openFileManager = (mode) => {
    onOpen();
    setFileManagerMode(mode);
    getFilesDataFromDatabase();
    // Reset the file name form
    setFileNameForm(getDefaultState(fileNameFormFields));
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
  function validateFolderName(folder_name, is_file) {
    let files_to_display = getFilesAndFoldersToDisplay();
    if (files_to_display.hasOwnProperty(folder_name)) {
      return {
        valid: false,
        error_msg: is_file ? localGetDisplayCopy("existing_file") : localGetDisplayCopy("existing_folder"),
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
  function closeFileManager() {
    setTimeout(() => {
      onClose();
    }, 500);
  }
  function saveFile() {
    let { valid_data, new_state } = validateInputData(fileNameForm, fileNameFormFields);
    setFileNameForm(new_state);
    if (valid_data) {
      setFileManagerWaiting(true);
      let model_blob = file.getModelBlob();
      let model_id = utils.generateUniqueID("file");
      let version_id = Date.now();
      let file_name = new_state.file_name.value;
      Firebase.saveFileToCloud(model_blob, file_name, model_id, version_id, JSON.parse(JSON.stringify(fileManagerPath)), (new_file) => {
        updateFileManagerData(new_file, true);
        // Close the file manager
        closeFileManager();
      });
    }
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
            <FileManagerView
              data={files_to_display}
              setFileManagerPath={setFileManagerPath}
              fileManagerPath={fileManagerPath}
              mode={fileManagerMode}
              closeFileManager={closeFileManager}
              setFileManagerWaiting={setFileManagerWaiting}
            />
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
    let fileman_footer = "";
    let close_button = (
      <Button variant="ghost" mr={3} onClick={onClose}>
        {utils.getDisplayCopy("auth", "close_modal")}
      </Button>
    );
    if (fileManagerMode === "save") {
      fileman_footer = (
        <>
          <FormComponent
            fields={fileNameFormFields}
            formState={fileNameForm}
            setFormState={setFileNameForm}
            copies_key="file_manager"
            error_msg_pos="top"
            use_placeholders={true}
            action_function={saveFile}
            firstFieldRef={file_name_ref}
          ></FormComponent>
          {close_button}
          <Button colorScheme="blue" onClick={saveFile}>
            {localGetDisplayCopy("save")}
          </Button>
        </>
      );
    } else {
      fileman_footer = (
        <>
          {close_button}
          <Button colorScheme="blue">{localGetDisplayCopy("open")}</Button>
        </>
      );
    }
    let path_navigator_and_buttons = (
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
    );
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {localGetDisplayCopy("title")} {path_navigator_and_buttons}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{fileman_body}</ModalBody>
          <ModalFooter alignItems={"end"}>{fileman_footer}</ModalFooter>
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
    <Breadcrumb fontWeight="normal" fontSize="medium">
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

function FileManagerView({ data, mode, setFileManagerPath, fileManagerPath, closeFileManager, setFileManagerWaiting }) {
  function handleClick(event, folder_name) {
    let new_path = JSON.parse(JSON.stringify(fileManagerPath));
    new_path.push(folder_name);
    setFileManagerPath(new_path);
  }
  function handleClickOnFile(event, file_name) {
    if (mode === "open") {
      setFileManagerWaiting(true);
      let { id, current_version } = data[file_name];
      Firebase.openFileFromCloud(id, current_version, (model_data) => {
        file.setModelFromParsedBlob(model_data);
        closeFileManager();
        // WIP - Ensure the settings/layouts are saved
        // WIP - Save and load if available the results
      });
    }
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
      let current_version = content.current_version;
      let current_stats = content.history[current_version];
      return (
        <File
          nodes={current_stats.num_nodes}
          lastModified={current_version}
          name={name}
          key={name}
          onClick={(evt) => {
            handleClickOnFile(evt, name);
          }}
        ></File>
      );
    }
  });
  return fileman_view;
}

export default FileManager;
