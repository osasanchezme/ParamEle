import React from "react";
import utils from "../utils";
import { FormControl, FormLabel, FormErrorMessage, Button, Input, Select, InputGroup, InputRightElement } from "@chakra-ui/react";

function FormComponent({ fields, handleInputChange, formState, copies_key }) {
  function localGetDisplayCopy(key) {
    return utils.getDisplayCopy(copies_key, key);
  }
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

function PasswordInput({ onChange }) {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input pr="4.5rem" type={show ? "text" : "password"} onChange={onChange} />
      <InputRightElement width="6.2rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? utils.getDisplayCopy("auth", "hide") : utils.getDisplayCopy("auth", "show")}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
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

const ParamEleForm = { FormComponent, validateInputData, getDefaultState };

export default ParamEleForm;
