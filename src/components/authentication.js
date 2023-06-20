import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Icon,
  Select,
  InputGroup,
  InputRightElement,
  SimpleGrid,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import utils from "../utils";
import { useState, useEffect } from "react";
import Firebase from "../js/firebase";

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("auth", copy_key);
}

function Authentication({ user }) {
  window.ParamEle.signOut = Firebase.signOutUser;
  const auth_form_fields = {
    name: { default: "", type: "text", validation: [{ type: "no", criteria: "", msg: "cannot_be_empty" }] },
    industry: {
      default: "",
      type: "dropdown",
      data: ["student", "teacher", "engineer", "architect", "other"],
      validation: [{ type: "no", criteria: "", msg: "cannot_be_empty" }],
    },
    company: {
      default: "",
      type: "text",
      validation: [{ type: "no", criteria: "", msg: "cannot_be_empty" }],
    },
    email: {
      default: "",
      type: "email",
      validation: [
        { type: "no", criteria: "" },
        { type: "contains", criteria: "@", msg: "no_valid_email" },
        { type: "contains", criteria: ".", msg: "no_valid_email" },
      ],
    },
    password: {
      default: "",
      type: "password",
      validation: [{ type: "no", criteria: "", msg: "cannot_be_empty" }],
    },
    verify_password: {
      default: "",
      type: "password",
      validation: [{ type: "equal_key", criteria: "password", msg: "passwords_no_match" }],
    },
  };
  const log_in_form_fields = {
    email: {
      default: "",
      type: "email",
      validation: [
        { type: "no", criteria: "" },
        { type: "contains", criteria: "@", msg: "no_valid_email" },
        { type: "contains", criteria: ".", msg: "no_valid_email" },
      ],
    },
    password: {
      default: "",
      type: "password",
      validation: [{ type: "no", criteria: "", msg: "cannot_be_empty" }],
    },
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  function getDefaultState(fields) {
    let default_state = {};
    Object.entries(fields).forEach(([key, data]) => {
      default_state[key] = {
        value: data.default,
        valid: true,
        error_msg: "",
      };
    });
    return default_state;
  }
  let [authFormState, setAuthFormState] = useState(getDefaultState(auth_form_fields));
  let [logInFormState, setLogInFormState] = useState(getDefaultState(log_in_form_fields));
  let [activeTab, setActiveTab] = useState("sign_up");
  window.ParamEle.openAuthentication = () => {
    // Reset the form if the user closes and opens it again
    setAuthFormState(getDefaultState(auth_form_fields));
    setLogInFormState(getDefaultState(log_in_form_fields));
    setActiveTab("sign_up");
    onOpen();
  };
  function createUser() {
    let { valid_data, new_state } = validateInputData(authFormState, auth_form_fields);
    setAuthFormState(new_state);
    if (valid_data) {
      Firebase.createUserWithEmail(authFormState);
      onClose();
    }
  }
  function logInUsingEmailPassword() {
    let { valid_data, new_state } = validateInputData(logInFormState, log_in_form_fields);
    setLogInFormState(new_state);
    if (valid_data) {
      Firebase.logInUserWithEmail(logInFormState);
      onClose();
    }
  }
  function validateInputData(current_state, fields) {
    let new_state = JSON.parse(JSON.stringify(current_state));
    let valid_data = true;
    Object.entries(fields).forEach(([key, data]) => {
      let user_input = new_state[key].value;
      data.validation.forEach((validation) => {
        switch (validation.type) {
          case "no":
            if (user_input === validation.criteria) {
              new_state[key].valid = false;
              new_state[key].error_msg = validation.msg;
              valid_data = false;
            }
            break;
          case "contains":
            if (!user_input.includes(validation.criteria)) {
              new_state[key].valid = false;
              new_state[key].error_msg = validation.msg;
              valid_data = false;
            }
            break;
          case "equal_key":
            if (user_input !== new_state[validation.criteria].value) {
              new_state[key].valid = false;
              new_state[key].error_msg = validation.msg;
              valid_data = false;
            }
            break;
          default:
            break;
        }
      });
    });
    return { valid_data, new_state };
  }
  function handleAuthInputChange(event, key) {
    let new_state = JSON.parse(JSON.stringify(authFormState));
    new_state[key].value = event.target.value;
    new_state[key].valid = true;
    setAuthFormState(new_state);
  }
  function handleLogInInputChange(event, key) {
    let new_state = JSON.parse(JSON.stringify(logInFormState));
    new_state[key].value = event.target.value;
    new_state[key].valid = true;
    setLogInFormState(new_state);
  }
  const tab_keys = ["sign_up", "log_in"];
  function handleTabsChange(index) {
    setActiveTab(tab_keys[index]);
  }
  if (user == null) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs onChange={handleTabsChange}>
              <TabList>
                {tab_keys.map((tab_name) => (
                  <Tab key={tab_name}>{localGetDisplayCopy(tab_name)}</Tab>
                ))}
              </TabList>
              <TabPanels>
                <TabPanel key={"sign_up"}>
                  <SimpleGrid columns={2} spacing={4}>
                    <FormComponent fields={auth_form_fields} formState={authFormState} handleInputChange={handleAuthInputChange}></FormComponent>
                  </SimpleGrid>
                </TabPanel>
                <TabPanel key={"log_in"}>
                  <SimpleGrid columns={1} spacing={4}>
                    <FormComponent fields={log_in_form_fields} formState={logInFormState} handleInputChange={handleLogInInputChange}></FormComponent>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {localGetDisplayCopy("close_modal")}
            </Button>
            {activeTab === "sign_up" ? (
              <Button colorScheme="blue" onClick={createUser}>
                {localGetDisplayCopy("sign_up")}
              </Button>
            ) : (
              ""
            )}
            {activeTab === "log_in" ? (
              <Button colorScheme="blue" onClick={logInUsingEmailPassword}>
                {localGetDisplayCopy("log_in")}
              </Button>
            ) : (
              ""
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}

function PasswordInput({ onChange }) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input pr="4.5rem" type={show ? "text" : "password"} onChange={onChange} />
      <InputRightElement width="6.2rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? localGetDisplayCopy("hide") : localGetDisplayCopy("show")}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

function FormComponent({ fields, handleInputChange, formState }) {
  return Object.entries(fields).map(([key, data]) => {
    let form_component = "";
    switch (data.type) {
      case "text":
      case "email":
        form_component = (
          <FormControl isInvalid={!formState[key].valid} key={key}>
            <FormLabel>{localGetDisplayCopy(key)}</FormLabel>
            <Input
              type={data.type}
              onChange={(evt) => {
                handleInputChange(evt, key);
              }}
            />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            <FormErrorMessage>{localGetDisplayCopy(formState[key].error_msg)}</FormErrorMessage>
          </FormControl>
        );
        break;
      case "dropdown":
        form_component = (
          <FormControl isInvalid={!formState[key].valid} key={key}>
            <FormLabel>{localGetDisplayCopy(key)}</FormLabel>
            <Select
              placeholder={localGetDisplayCopy("select")}
              onChange={(evt) => {
                handleInputChange(evt, key);
              }}
            >
              {data.data.map((option_name) => (
                <option value={option_name} key={option_name}>
                  {localGetDisplayCopy(option_name)}
                </option>
              ))}
            </Select>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            <FormErrorMessage>{localGetDisplayCopy(formState[key].error_msg)}</FormErrorMessage>
          </FormControl>
        );
        break;
      case "password":
        form_component = (
          <FormControl isInvalid={!formState[key].valid} key={key}>
            <FormLabel>{localGetDisplayCopy(key)}</FormLabel>
            <PasswordInput
              onChange={(evt) => {
                handleInputChange(evt, key);
              }}
            />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            <FormErrorMessage>{localGetDisplayCopy(formState[key].error_msg)}</FormErrorMessage>
          </FormControl>
        );
        break;
      default:
        break;
    }
    return form_component;
  });
}

export default Authentication;
