import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { MdOutlineFileUpload } from "react-icons/md";

export default function Upload(props) {
  const { isOpen, onOpenChange } = props;
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload File
              </ModalHeader>
              <ModalBody className="gap-4 pb-8 ">
                <div className="flex items-center justify-center" >
                  <MdOutlineFileUpload className="text-black text-9xl text-opacity-50" />
                </div>
                <div className="flex items-center justify-center  " >
                  <p className="text-black text-2xl text-opacity-50" >
                    Click to upload file
                  </p>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
