import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Progress
} from "@nextui-org/react";
import { useState, useRef } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { upload } from "./ApiService";

export default function Upload(props) {
  const { isOpen, onOpenChange, onClose } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    upload(formData, setProgress).then(r => {
      onClose()
    }).catch(r => {

    })
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <input type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} />
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload File
              </ModalHeader>
              {
                !selectedFile ?
                  <ModalBody className="gap-4 pb-8 " onClick={handleClick}>
                    <div className="flex items-center justify-center" >
                      <MdOutlineFileUpload className="text-black text-9xl text-opacity-50" />
                    </div>
                    <div className="flex items-center justify-center" >
                      <p className="text-black text-2xl text-opacity-50" >
                        Click to upload file
                      </p>
                    </div>
                  </ModalBody> : <div className="flex flex-col p-8">
                    <div className="flex flex-col gap-6 w-full max-w-md pb-8">
                      <Progress size="lg" aria-label="Uploading..." value={progress} />
                    </div>
                    <Button onClick={handleUpload} isLoading={(progress !== 0)} >
                      Upload
                    </Button>
                  </div>
              }
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
