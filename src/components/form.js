import React from "react";
import utils from "../utils";
import { FormControl, FormLabel, FormErrorMessage, Button, Input, Select, InputGroup, InputRightElement } from "@chakra-ui/react";

/**
 * @typedef {Object} ValidationObject
 * @property {"equal_key"|"no"|"contains"} type
 * @property {string} criteria
 * @property {string} msg Key of the message in the copies
 */
/**
 * @typedef {Object} FormField
 * @property {String} default Default value
 * @property {"text"|"email"|"dropdown"|"password"} type Type of the field
 * @property {Array.<ValidationObject>} validation
 * @property {Boolean} is_first_field
 */
/**
 *
 * @param {Object} param0
 * @param {Object.<string, FormField>} param0.fields
 * @param {function(evt:InputEvent, key:String)} param0.handleInputChange Function to update the given key
 * @param {Object} param0.formState Object that controls the state of the form directly from React's useState
 * @param {String} param0.copies_key Key under which all the copies are found
 * @param {String} param0.firstFieldRef Reference to the first child to be focused
 * @param {String} param0.action_function Function to run on Enter, it should taka care of the validation
 * @param {"top"|"bottom"} param0.error_msg_pos Location of the error message with respect to the input field
 * @param {boolean} param0.use_placeholders Use placeholders instead of labels
 * @returns
 */
function FormComponent({ fields, setFormState, formState, copies_key, firstFieldRef, action_function, error_msg_pos, use_placeholders }) {
  if (error_msg_pos !== "top") error_msg_pos = "bottom";
  function localGetDisplayCopy(key) {
    return utils.getDisplayCopy(copies_key, key);
  }
  function handleInputChange(event, key) {
    let new_state = JSON.parse(JSON.stringify(formState));
    new_state[key].value = event.target.value;
    new_state[key].valid = true;
    setFormState(new_state);
  }
  function handleKeyUpOnField(event, key) {
    handleInputChange(event, key);
    let last_key = event.key;
    if (last_key === "Enter") {
      if (action_function) {
        action_function();
      }
    }
  }
  return Object.entries(fields).map(([key, data]) => {
    let form_component = "";
    let form_error_msg = <FormErrorMessage>{localGetDisplayCopy(formState[key].error_msg)}</FormErrorMessage>;
    let form_label = use_placeholders ? "" : <FormLabel>{localGetDisplayCopy(key)}</FormLabel>;
    switch (data.type) {
      case "text":
      case "email":
        form_component = (
          <FormControl isInvalid={!formState[key].valid} key={key}>
            {form_label}
            {error_msg_pos === "top" ? form_error_msg : ""}
            <Input
              ref={data.is_first_field ? firstFieldRef : null}
              type={data.type}
              onChange={(evt) => {
                handleInputChange(evt, key);
              }}
              onKeyUp={(evt) => {
                handleKeyUpOnField(evt, key);
              }}
              placeholder={use_placeholders ? localGetDisplayCopy(key) : ""}
            />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            {error_msg_pos === "bottom" ? form_error_msg : ""}
          </FormControl>
        );
        break;
      case "dropdown":
        form_component = (
          <FormControl isInvalid={!formState[key].valid} key={key}>
            {form_label}
            {error_msg_pos === "top" ? form_error_msg : ""}
            <Select
              placeholder={localGetDisplayCopy("select")}
              onChange={(evt) => {
                handleInputChange(evt, key);
              }}
              onKeyUp={(evt) => {
                handleKeyUpOnField(evt, key);
              }}
            >
              {data.data.map((option_name) => (
                <option value={option_name} key={option_name}>
                  {localGetDisplayCopy(option_name)}
                </option>
              ))}
            </Select>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            {error_msg_pos === "bottom" ? form_error_msg : ""}
          </FormControl>
        );
        break;
      case "password":
        form_component = (
          <FormControl isInvalid={!formState[key].valid} key={key}>
            {form_label}
            {error_msg_pos === "top" ? form_error_msg : ""}
            <PasswordInput
              onChange={(evt) => {
                handleInputChange(evt, key);
              }}
              onKeyUp={(evt) => {
                handleKeyUpOnField(evt, key);
              }}
            />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            {error_msg_pos === "bottom" ? form_error_msg : ""}
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
        case "custom_function":
          let custom_validation = validation.criteria(user_input);
          if (!custom_validation.valid) {
            new_state[key].valid = false;
            new_state[key].error_msg = custom_validation.error_msg;
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
