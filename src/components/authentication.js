import React, { useEffect, useState } from "react";
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
import utils from "../utils";
import Firebase from "../js/firebase";
import {auth_form_fields, log_in_form_fields} from "../js/form_fileds";
import ParamEleForm from "./form";
const { FormComponent, getDefaultState, validateInputData } = ParamEleForm;

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("auth", copy_key);
}

function Authentication({ user, is_auth_form_open, closeAuthenticationForm, active_tab_auth_form, setActiveTabAuthenticationForm }) {
  
  let [authFormState, setAuthFormState] = useState(getDefaultState(auth_form_fields));
  let [logInFormState, setLogInFormState] = useState(getDefaultState(log_in_form_fields));
  useEffect(()=> {
    setAuthFormState(getDefaultState(auth_form_fields));
    setLogInFormState(getDefaultState(log_in_form_fields));
  }, []);
  function createUser() {
    let { valid_data, new_state } = validateInputData(authFormState, auth_form_fields);
    setAuthFormState(new_state);
    if (valid_data) {
      Firebase.createUserWithEmail(authFormState);
      closeAuthenticationForm();
    }
  }
  function logInUsingEmailPassword() {
    let { valid_data, new_state } = validateInputData(logInFormState, log_in_form_fields);
    setLogInFormState(new_state);
    if (valid_data) {
      utils.showLoadingDimmer("logging_in");
      Firebase.logInUserWithEmail(logInFormState, () => {
        closeAuthenticationForm();
        utils.hideLoadingDimmer();
      });
    }
  }
  const tab_keys = ["sign_up", "log_in"];
  function handleTabsChange(index) {
    setActiveTabAuthenticationForm(tab_keys[index]);
  }
  if (user == null) {
    return (
      <Modal isOpen={is_auth_form_open} onClose={closeAuthenticationForm} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs onChange={handleTabsChange} defaultIndex={tab_keys.indexOf(active_tab_auth_form)}>
              <TabList>
                {tab_keys.map((tab_name) => (
                  <Tab key={tab_name}>{localGetDisplayCopy(tab_name)}</Tab>
                ))}
              </TabList>
              <TabPanels>
                <TabPanel key={"sign_up"}>
                  <SimpleGrid columns={2} spacing={4}>
                    <FormComponent fields={auth_form_fields} formState={authFormState} setFormState={setAuthFormState} copies_key="auth"></FormComponent>
                  </SimpleGrid>
                </TabPanel>
                <TabPanel key={"log_in"}>
                  <SimpleGrid columns={1} spacing={4}>
                    <FormComponent fields={log_in_form_fields} formState={logInFormState} setFormState={setLogInFormState} copies_key="auth"></FormComponent>
                  </SimpleGrid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeAuthenticationForm}>
              {localGetDisplayCopy("close_modal")}
            </Button>
            {active_tab_auth_form === "sign_up" ? (
              <Button colorScheme="blue" onClick={createUser}>
                {localGetDisplayCopy("sign_up")}
              </Button>
            ) : (
              ""
            )}
            {active_tab_auth_form === "log_in" ? (
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
