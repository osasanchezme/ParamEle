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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import utils from "../utils";
import { useState } from "react";
import Firebase from "../js/firebase";
import ParamEleForm from "./form";
const { FormComponent, getDefaultState, validateInputData } = ParamEleForm;

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
                    <FormComponent fields={auth_form_fields} formState={authFormState} handleInputChange={handleAuthInputChange} copies_key="auth"></FormComponent>
                  </SimpleGrid>
                </TabPanel>
                <TabPanel key={"log_in"}>
                  <SimpleGrid columns={1} spacing={4}>
                    <FormComponent fields={log_in_form_fields} formState={logInFormState} handleInputChange={handleLogInInputChange} copies_key="auth"></FormComponent>
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

export default Authentication;
