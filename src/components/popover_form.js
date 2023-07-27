import {
  useDisclosure,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Flex,
  Spacer,
  IconButton,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FocusLock } from "@chakra-ui/react";
import { useState, useRef } from "react";
import ParamEleForm from "./form";
const { FormComponent, getDefaultState, validateInputData } = ParamEleForm;

const PopoverForm = ({ children, fields, copies_key, action_function, action_button_text, options = {} }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);
  const [formState, setFormState] = useState(getDefaultState(fields));
  let { placement, prepend_content, append_content } = options;
  if (placement === undefined) placement = "right";
  if (prepend_content === undefined) prepend_content = "";
  if (append_content === undefined) append_content = "";
  function handleClickOnButton(evt) {
    let { valid_data, new_state } = validateInputData(formState, fields);
    setFormState(new_state);
    if (valid_data) {
      action_function(formState);
      onClose();
    }
  }
  return (
    <>
      <Popover isOpen={isOpen} initialFocusRef={firstFieldRef} onOpen={onOpen} onClose={onClose} placement={placement} closeOnBlur={false}>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            {prepend_content}
            <FormComponent
              fields={fields}
              formState={formState}
              setFormState={setFormState}
              copies_key={copies_key}
              firstFieldRef={firstFieldRef}
              action_function={handleClickOnButton}
            />
            <Flex justify="right" marginTop="var(--chakra-space-2)">
              <Button size="sm" textTransform="capitalize" variant="outline" colorScheme="gray" onClick={handleClickOnButton}>
                {action_button_text}
              </Button>
            </Flex>
            {append_content}
          </FocusLock>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PopoverForm;
