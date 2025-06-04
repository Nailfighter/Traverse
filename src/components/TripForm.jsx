import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Form,
  Input,
  DateRangePicker,
  DatePicker,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

import { PlusIcon } from "@heroicons/react/24/solid";

export default function TripForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <div>
      <Button isIconOnly variant="light" onPress={onOpen} className="w-full">
        <PlusIcon className="w-5 h-5" />
      </Button>
      <Modal
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <Form validationBehavior="aria">

                  <Input
                    name="username"
                    label="Where are you going?"
                    labelPlacement="outside"
                    placeholder="New York"
                    description="Type atleast two characters to start searching"
                    isRequired
                    isClearable
                  />

                  <DatePicker
                    description="outside"
                    label="When are you planning to travel?"
                    labelPlacement="outside"
                    minValue={today(getLocalTimeZone())}
                  />
                  
                  <Button type="submit">Submit</Button>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
