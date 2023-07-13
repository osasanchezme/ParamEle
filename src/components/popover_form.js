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
} from "@chakra-ui/react";
import { FocusLock } from "@chakra-ui/react";
import { useState, useRef } from "react";
import ParamEleForm from "./form";
const { FormComponent, getDefaultState, validateInputData } = ParamEleForm;

const PopoverForm = ({ children, fields, copies_key, action_function, action_button_icon }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);
  const [formState, setFormState] = useState(getDefaultState(fields));
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
      <Popover isOpen={isOpen} initialFocusRef={firstFieldRef} onOpen={onOpen} onClose={onClose} placement="right" closeOnBlur={false}>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <Flex alignItems="center" gap="2">
              <FormComponent
                fields={fields}
                formState={formState}
                setFormState={setFormState}
                copies_key={copies_key}
                firstFieldRef={firstFieldRef}
                action_function={handleClickOnButton}
              />
              <Spacer />
              <IconButton icon={<Icon as={action_button_icon} boxSize={6} />} onClick={handleClickOnButton} />
            </Flex>
          </FocusLock>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PopoverForm;
