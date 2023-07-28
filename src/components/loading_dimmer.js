import { Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, Spinner, Center, VStack, Box } from "@chakra-ui/react";
import { useState } from "react";
import utils from "../utils";

function localGetDisplayCopy(copy_key) {
  return utils.getDisplayCopy("waiting_dimmer", copy_key);
}

function LoadingDimmer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dimmer_msg, setDimmerMsg] = useState(localGetDisplayCopy("loading"));
  window.ParamEle.showLoadingDimmer = (msg) => {
    onOpen();
    msg = localGetDisplayCopy(msg);
    if (msg !== undefined) setDimmerMsg(msg);
  };
  window.ParamEle.hideLoadingDimmer = () => {
    onClose();
  };
  window.ParamEle.setLoadingDimmerMsg = (msg) => {
    msg = localGetDisplayCopy(msg);
    setDimmerMsg(msg);
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen} closeOnOverlayClick={false} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Center h="200px">
            <VStack>
              <Box maxW="sm">
                <Spinner size="xl" speed="0.8s" />
              </Box>
              <Box>{dimmer_msg}...</Box>
            </VStack>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export { LoadingDimmer };
