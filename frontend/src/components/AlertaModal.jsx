import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

function AlertaModal ({
    isOpen, 
    onClose, 
    titulo = "Ups...", 
    mensaje,
    onConfirm, 
    confirmText = "Aceptar",
}) {

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />

            <ModalContent>
                <ModalHeader>{titulo}</ModalHeader>

                <ModalBody>
                    <Text>{mensaje}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onConfirm || onClose}>
                        {confirmText}
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
}

export default AlertaModal;