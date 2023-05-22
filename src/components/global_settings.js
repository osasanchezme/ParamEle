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
  Link,
  Icon,
  Select,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import utils from "../utils";
import getState from "../getState";
import { useState } from "react";
import state from "../state";
import { MdOpenInNew } from "react-icons/md";
import settings_template from "../settings_template.json";
import logic_runner from "../js/globalLogicRunner";

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
    logic_runner.run();
  }
  const global_settings = settings_template["global"];
  const settings_tabs = {};
  Object.entries(global_settings).forEach(([setting_name, setting_options], index) => {
    if (!settings_tabs.hasOwnProperty(setting_options["tab"])) settings_tabs[setting_options["tab"]] = [];
    settings_tabs[setting_options["tab"]].push({ name: setting_name, type: setting_options.type, data: setting_options.data });
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{localGetDisplayCopy("modal_title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              {Object.keys(settings_tabs).map((tab_name) => (
                <Tab key={tab_name}>{localGetDisplayCopy(tab_name)}</Tab>
              ))}
            </TabList>
            <TabPanels>
              {Object.entries(settings_tabs).map(([tab_name, tab_settings], index) => (
                <TabPanel key={tab_name}>
                  {tab_settings.map((setting) => {
                    let setting_block = null;
                    switch (setting.type) {
                      case "text":
                        setting_block = (
                          <FormControl key={setting.name}>
                            <FormLabel>{localGetDisplayCopy(setting.name)}</FormLabel>
                            <Input
                              type="text"
                              defaultValue={localSettings[setting.name]}
                              onChange={(event) => {
                                handleChange(event, setting.name);
                              }}
                            />
                          </FormControl>
                        );
                        break;
                      case "link":
                        setting_block = (
                          <p style={{ textAlign: "right" }} key={setting.name}>
                            <Link href={setting.data} color="blue" isExternal>
                              {localGetDisplayCopy(setting.name)} <Icon as={MdOpenInNew} mx="2px" />
                            </Link>
                          </p>
                        );
                        break;
                      case "dropdown":
                        setting_block = (
                          <FormControl key={setting.name}>
                            <FormLabel>{localGetDisplayCopy(setting.name)}</FormLabel>
                            <Select
                              onChange={(event) => {
                                handleChange(event, setting.name);
                              }}
                              defaultValue={localSettings[setting.name]}
                            >
                              {setting.data.map((option) => (
                                <option value={option} key={option}>
                                  {localGetDisplayCopy(option)}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        );
                        break;
                      default:
                        break;
                    }
                    return setting_block;
                  })}
                </TabPanel>
              ))}
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
