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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import utils from "../utils";
import getState from "../getState";
import { useState } from "react";
import state from "../state";

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("settings", copy_key);
}

function GlobalSettings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  window.ParamEle.openGlobalSettings = onOpen;
  let settings = getState("settings")["global"];
  let [localSettings, setLocalSettings] = useState(settings);
  function handleChange(event, id) {
    localSettings[id] = event.target.value;
    setLocalSettings(localSettings);
  }
  function saveSettings() {
    let original_settings = getState("settings");
    original_settings["global"] = localSettings;
    state.setState(original_settings, "settings");
    onClose();
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{localGetDisplayCopy("modal_title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>{localGetDisplayCopy("solver_tab")}</Tab>
              <Tab>...</Tab>
              <Tab>...</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <FormControl>
                  <FormLabel>{localGetDisplayCopy("solver_username")}</FormLabel>
                  <Input
                    type="text"
                    defaultValue={localSettings.solver_username}
                    onChange={(event) => {
                      handleChange(event, "solver_username");
                    }}
                  />
                  {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                  <FormLabel>{localGetDisplayCopy("solver_key")}</FormLabel>
                  <Input
                    type="text"
                    defaultValue={localSettings.solver_key}
                    onChange={(event) => {
                      handleChange(event, "solver_key");
                    }}
                  />
                  {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                </FormControl>
              </TabPanel>
              <TabPanel>
                <p>...</p>
              </TabPanel>
              <TabPanel>
                <p>...</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={saveSettings}>
            {localGetDisplayCopy("save_changes")}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            {localGetDisplayCopy("close_modal")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default GlobalSettings;
