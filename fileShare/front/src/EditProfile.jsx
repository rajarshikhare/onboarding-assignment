import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { update } from "./ApiService";

export default function EditProfile(props) {
  const { isOpen, onOpenChange, onClose } = props;
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onSubmit = () => {
    setLoading(true);
    update({
      name,
      username,
    })
      .then(() => {
        onClose()
      })
      .catch((err) => {
        setErrors(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Profile
              </ModalHeader>
              <ModalBody className="gap-4">
                <Input
                  autoFocus
                  label="Username"
                  placeholder="Enter your username"
                  type="text"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!errors["username"]}
                  errorMessage={errors["username"]}
                />
                <Input
                  label="Name"
                  placeholder="Enter your name"
                  variant="bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!errors["name"]}
                  errorMessage={errors["name"]}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} isDisabled={loading}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onSubmit} isLoading={loading}>
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
