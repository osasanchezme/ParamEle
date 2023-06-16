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

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("auth", copy_key);
}

function Authentication() {
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  function getDefaultState() {
    let default_state = {};
    Object.entries(auth_form_fields).forEach(([key, data]) => {
      default_state[key] = {
        value: data.default,
        valid: true,
        error_msg: "",
      };
    });
    return default_state;
  }
  let [formState, setFormState] = useState(getDefaultState());
  window.ParamEle.openAuthentication = () => {
    // Reset the form if the user closes and opens it again
    setFormState(getDefaultState());
    onOpen();
  };
  function createUser() {
    validateInputData();
  }
  function validateInputData() {
    let new_state = JSON.parse(JSON.stringify(formState));
    Object.entries(auth_form_fields).forEach(([key, data]) => {
      let user_input = new_state[key].value;
      data.validation.forEach((validation) => {
        switch (validation.type) {
          case "no":
            if (user_input === validation.criteria) {
              new_state[key].valid = false;
              new_state[key].error_msg = validation.msg;
            }
            break;
          case "contains":
            if (!user_input.includes(validation.criteria)) {
              new_state[key].valid = false;
              new_state[key].error_msg = validation.msg;
            }
            break;
          case "equal_key":
            if (user_input !== new_state[validation.criteria].value) {
              new_state[key].valid = false;
              new_state[key].error_msg = validation.msg;
            }
            break;
          default:
            break;
        }
      });
    });
    setFormState(new_state);
  }
  function handleInputChange(event, key) {
    let new_state = JSON.parse(JSON.stringify(formState));
    new_state[key].value = event.target.value;
    new_state[key].valid = true;
    setFormState(new_state);
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{localGetDisplayCopy("title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              {["sign_up", "log_in"].map((tab_name) => (
                <Tab key={tab_name}>{localGetDisplayCopy(tab_name)}</Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel key={"sign_up"}>
                <SimpleGrid columns={2} spacing={4}>
                  {Object.entries(auth_form_fields).map(([key, data]) => {
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
                  })}
                </SimpleGrid>
              </TabPanel>
              <TabPanel key={"log_in"}>
                <FormControl>
                  <FormLabel>Email addressssss</FormLabel>
                  <Input type="email" />
                  {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
                </FormControl>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {localGetDisplayCopy("close_modal")}
          </Button>
          <Button colorScheme="blue" onClick={createUser}>
            {localGetDisplayCopy("sign_up")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
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

export default Authentication;
